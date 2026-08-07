import { useNavigate } from 'react-router-dom'
import CornerLines from '../components/decor/CornerLines.jsx'
import SpecularButton from '../components/ui/SpecularButton.jsx'
import SB from '../components/ui/buttonPresets.js'
import './NotFound.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="nf">
      <CornerLines className="nf__lines" stroke="rgba(255,255,255,0.14)" />
      <div className="shell nf__inner">
        <span className="eyebrow">404</span>
        <h1 className="nf__title">This page is not on the map.</h1>
        <p className="nf__text">
          The link is broken or the page has moved. The library, at least, is exactly where it was.
        </p>
        <div className="nf__actions">
          <SpecularButton {...SB.gold} size="md" onClick={() => navigate('/')}>
            Back to home
          </SpecularButton>
          <SpecularButton {...SB.ghost} size="md" onClick={() => navigate('/app')}>
            Open the library
          </SpecularButton>
        </div>
      </div>
    </div>
  )
}
