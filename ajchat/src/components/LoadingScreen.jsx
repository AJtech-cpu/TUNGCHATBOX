import { useState, useEffect } from 'react'

export default function LoadingScreen({ onDone }) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const dur   = 3200
    const iv    = setInterval(() => {
      const p = Math.min(100, Math.round(((Date.now() - start) / dur) * 100))
      setPct(p)
      if (p >= 100) { clearInterval(iv); setTimeout(onDone, 250) }
    }, 30)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="loading-screen">
      <div className="loading-logo">💬</div>
      <div className="loading-title">TUNGCHATBOX</div>
      <div className="loading-sub">✨ made by: the one and only AJ himself ✨</div>
      <div className="loading-bar">
        <div className="loading-fill" style={{ width: pct + '%' }} />
      </div>
      <div className="loading-credit">Loading your server… {pct}%</div>
    </div>
  )
}
