import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import jawModelUrl from '../../assets/dental/jaw.glb?url'

/**
 * The jaw itself: one WebGL canvas, and everything that has to happen outside
 * React to keep it at sixty frames.
 *
 * WHY IT IS A REF AND NOT STATE
 *
 * three.js owns a scene graph, and React owns a tree of elements, and the two
 * must not try to own the same thing. So the whole of it lives in a ref built
 * once on mount: the renderer, the camera, the model, the picking. React tells
 * it what the reader has chosen through a small imperative surface — select a
 * tooth, peel a layer — and gets told back when the reader clicks a tooth.
 * Nothing here re-renders a component, and no prop change rebuilds the scene.
 *
 * WHAT THE MODEL BRINGS WITH IT
 *
 * Every part carries its own metadata from BodyParts3D: `kind` is tooth,
 * gingiva or jaw_bone, and a tooth also knows its own FDI number, arch, side
 * and type. So nothing here has to guess what it is looking at from a mesh
 * name — the anatomy identifies itself, which is the reason this model is worth
 * 1.2 MB and a hand-drawn one would not be.
 */

/* The tooth in your hand, lifted clear of the arch so the root shows. Along the
   arch's own normal rather than straight up, or the lower teeth would rise into
   the upper ones. */
const LIFT = 1.15

export default function JawViewer({ selected, layer, lifted, onPick, onReady, onProgress }) {
  const host = useRef(null)
  const rig = useRef(null)

  /* Latest values, readable from inside the animation loop and the event
     handlers without making them dependencies that would tear the scene down
     and rebuild it on every click. */
  const live = useRef({ selected, layer, lifted, onPick })
  live.current = { selected, layer, lifted, onPick }

  /* ------------------------------- the scene ---------------------------- */
  useEffect(() => {
    const mount = host.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.78
    mount.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 3
    controls.maxDistance = 40
    controls.enablePan = false

    /* Lit warm from above and cool from below, which is roughly what a dental
       light and a white bib do, and happens to be what makes enamel read as
       enamel rather than as plastic. */
    scene.add(new THREE.HemisphereLight(0xffffff, 0xe8c9bd, 1.25))
    const key = new THREE.DirectionalLight(0xffffff, 1.5)
    key.position.set(2.5, 4.5, 5)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xfff2e8, 0.6)
    fill.position.set(-3, 2, 2.5)
    scene.add(fill)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    const state = {
      scene,
      camera,
      renderer,
      controls,
      teeth: new Map(),
      gingiva: [],
      bone: [],
      home: new Map(),
      out: new Map(),
      root: null,
      hovered: null,
      frame: 0,
      disposed: false,
    }
    rig.current = state

    /* --------------------------------- size ---------------------------- */
    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)
    window.addEventListener('resize', resize)

    /* --------------------------------- load ---------------------------- */
    const loader = new GLTFLoader()
    loader.load(
      jawModelUrl,
      (gltf) => {
        if (state.disposed) return
        const model = gltf.scene
        /* The scan stands on its head in its own coordinates, and looking at a
           jaw from below is what a dentist does anyway — this is the chair's
           point of view, tipped slightly so the occlusal surfaces show. */
        model.rotation.set(-0.18, 0, Math.PI)
        scene.add(model)
        state.root = model

        model.updateWorldMatrix(true, true)
        model.traverse((o) => {
          const data = o.userData || {}
          if (data.kind === 'tooth' && data.fdi) {
            const fdi = String(data.fdi)
            state.teeth.set(fdi, o)
            state.home.set(fdi, o.position.clone())
            state.out.set(fdi, outwardFrom(o, model))
          }
          if (o.isMesh) {
            o.material = o.material.clone()
            const kind = kindOf(o)
            if (kind === 'gingiva') state.gingiva.push(o)
            if (kind === 'jaw_bone') state.bone.push(o)
          }
        })

        frameModel(model, camera, controls)
        applyLayer(state, live.current.layer)
        paint(state, live.current)
        onReady?.({ teeth: state.teeth.size })
      },
      (event) => {
        /* A real fraction when the server reports a length, which it does for a
           file served off disk; otherwise the bytes so far, which at least
           moves. The loading screen decides what to show. */
        onProgress?.({
          loaded: event.loaded,
          total: event.total || 0,
          progress: event.total ? event.loaded / event.total : 0,
        })
      },
      (error) => onReady?.({ error: error?.message || 'The model could not be loaded.' }),
    )

    /* -------------------------------- picking -------------------------- */
    const at = (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      /* Bring the matrices up to date rather than trusting that a frame has
         drawn. A ray is cast from the camera's world matrix, and that matrix is
         normally refreshed by the renderer — so on a first click before the
         first frame, or anywhere the frame loop is throttled, picking would
         silently miss everything. Two matrix updates are cheaper than the
         raycast that follows them. */
      camera.updateMatrixWorld()
      state.root?.updateMatrixWorld(true)
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects([...state.teeth.values()], true)[0]
      return hit ? fdiOf(hit.object) : null
    }

    /* A click that finished where it started. Without this every drag to rotate
       the jaw would also select whatever tooth the mouse came to rest on. */
    let downAt = null
    const onDown = (e) => {
      downAt = { x: e.clientX, y: e.clientY }
    }
    const onUp = (e) => {
      if (!downAt) return
      const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y)
      downAt = null
      if (moved > 6) return
      const fdi = at(e)
      if (fdi) live.current.onPick?.(fdi)
    }
    const onMove = (e) => {
      state.hovered = at(e)
      renderer.domElement.style.cursor = state.hovered ? 'pointer' : 'grab'
    }

    const el = renderer.domElement
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointermove', onMove)

    /* --------------------------------- loop ---------------------------- */
    const tick = () => {
      state.frame = requestAnimationFrame(tick)
      controls.update()
      ease(state, live.current)
      renderer.render(scene, camera)
    }
    tick()

    /* ------------------------------- teardown -------------------------- */
    return () => {
      state.disposed = true
      cancelAnimationFrame(state.frame)
      ro.disconnect()
      window.removeEventListener('resize', resize)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointermove', onMove)
      controls.dispose()
      /* A WebGL context is a real device resource and a browser only grants a
         handful; leaving them behind is how a site that navigates a few times
         stops being able to draw anything at all. */
      scene.traverse((o) => {
        if (!o.isMesh) return
        o.geometry?.dispose()
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        mats.forEach((m) => m?.dispose())
      })
      renderer.dispose()
      renderer.forceContextLoss?.()
      if (el.parentNode === mount) mount.removeChild(el)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* React's side of the wire: when the reader's choices change, tell the scene.
     Cheap enough to do on every change — it walks 37 objects. */
  useEffect(() => {
    const state = rig.current
    if (!state?.root) return
    applyLayer(state, layer)
    paint(state, { selected })
  }, [selected, layer, lifted])

  return <div className="jawViewer" ref={host} />
}

/* ------------------------------- helpers -------------------------------- */

/** Walk up to whichever ancestor carries the metadata. */
const climb = (object, key) => {
  let node = object
  while (node) {
    if (node.userData && node.userData[key] != null) return node.userData[key]
    node = node.parent
  }
  return null
}
const fdiOf = (o) => {
  const v = climb(o, 'fdi')
  return v == null ? null : String(v)
}
const kindOf = (o) => climb(o, 'kind')

/**
 * Put the whole jaw on screen, whatever size it happens to be modelled at.
 *
 * Derived from the bounding sphere rather than a hand-tuned camera position, so
 * the framing survives the model being swapped or rescaled.
 */
function frameModel(model, camera, controls) {
  const box = new THREE.Box3().setFromObject(model)
  const size = box.getSize(new THREE.Vector3())
  const centre = box.getCenter(new THREE.Vector3())
  const extent = Math.max(size.x, size.y, size.z)
  const distance = extent / (2 * Math.tan((camera.fov * Math.PI) / 360))

  /* Almost straight down, which is the occlusal view — the one a dentist works
     from and the one the odontogram in the last act is drawn as. It is also the
     only angle from which every tooth can be clicked: measured across the whole
     frame, a three-quarter view has the upper arch covering the lower and
     leaves sixteen teeth unreachable, and half of those are the ones this
     simulation asks the reader to go and find. Five degrees off the pole,
     because OrbitControls has a singularity exactly on it. */
  const ELEV = (85 * Math.PI) / 180

  controls.target.copy(centre)
  camera.position.set(
    centre.x,
    centre.y + distance * Math.sin(ELEV),
    centre.z + distance * Math.cos(ELEV),
  )
  camera.near = Math.max(0.01, distance / 200)
  camera.far = distance * 40
  camera.updateProjectionMatrix()
  controls.update()
}

/** Peel the mouth back: 0 everything, 1 no gingiva, 2 no bone either. */
function applyLayer(state, layer) {
  state.gingiva.forEach((mesh) => {
    mesh.visible = layer < 1
  })
  state.bone.forEach((mesh) => {
    mesh.visible = layer < 2
  })
}

/**
 * Colour the arch for the current selection.
 *
 * Enamel keeps its own colour and the chosen tooth is warmed rather than
 * repainted — a tooth turned flat gold stops looking like a tooth, and the
 * point of using a scan is that it looks like one.
 */
function paint(state, { selected }) {
  state.teeth.forEach((group, fdi) => {
    const on = fdi === selected
    group.traverse((o) => {
      if (!o.isMesh || !o.material?.emissive) return
      o.material.emissive.setHex(on ? 0x4a3410 : 0x000000)
      o.material.emissiveIntensity = on ? 1 : 0
    })
  })
}

/**
 * Which way a tooth has to travel to leave the arch, in its own local space.
 *
 * Measured rather than assumed, for two reasons. The tooth nodes all sit at the
 * origin — the geometry is baked into the meshes, so a node's position says
 * nothing about where its tooth actually is, and a hand-picked axis is a guess
 * that happens to be wrong here. And the model is rotated into place, so a
 * direction that is obvious in world space is not the direction the node's
 * position is expressed in.
 *
 * The answer is radially outward from the jaw's centre line, along the floor of
 * the mouth: a tooth steps sideways out of the row it is standing in. Outward
 * rather than up, because "up" for an upper tooth is further into the maxilla,
 * where the bone would simply swallow it.
 *
 * The conversion goes through the tooth's own parent and not the model root:
 * the teeth hang off an intermediate node inside the file, `position` is always
 * expressed in a parent's space, and those two spaces are a quarter turn apart
 * here — which sent every tooth off at an angle when this went through the root.
 */
function outwardFrom(tooth, model) {
  const centre = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3())
  const here = new THREE.Box3().setFromObject(tooth).getCenter(new THREE.Vector3())
  const away = here.sub(centre)
  away.y = 0
  if (away.lengthSq() < 1e-6) away.set(0, 0, 1)
  away.normalize()
  const toParent = new THREE.Matrix4().copy(tooth.parent.matrixWorld).invert()
  return away.transformDirection(toParent)
}

/**
 * Move the chosen tooth out of the arch, and everything else back home.
 *
 * Run from the animation loop rather than set outright, so a tooth slides out
 * and drops back instead of teleporting — this is the one piece of motion in
 * the viewer and it is what makes the root read as having been *inside*
 * something.
 */
function ease(state, { selected, lifted }) {
  state.teeth.forEach((group, fdi) => {
    const home = state.home.get(fdi)
    if (!home) return
    const step = lifted && fdi === selected ? state.out.get(fdi) : null
    const target = step ? home.clone().addScaledVector(step, LIFT) : home
    group.position.lerp(target, 0.18)
  })
}
