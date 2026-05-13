import { useState } from 'react'
import { BAD_WORDS } from '../constants.js'

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [u, setU]       = useState('')
  const [p, setP]       = useState('')
  const [err, setErr]   = useState('')

  const go = () => {
    setErr('')
    if (!u.trim() || !p.trim()) return setErr('Please fill in all fields')
    onAuth(mode, u.trim(), p, setErr)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <div className="auth-hero">
          <span className="auth-logo">💬</span>
          <h1>{mode === 'login' ? 'Welcome back!' : 'Create account'}</h1>
          <p>{mode === 'login' ? 'Great to see you again!' : 'Join the community today'}</p>
        </div>

        <label className="form-label">Username</label>
        <input
          className="form-input"
          value={u}
          onChange={e => setU(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && go()}
          placeholder="Enter your username"
        />

        <label className="form-label">Password</label>
        <input
          className="form-input"
          type="password"
          value={p}
          onChange={e => setP(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && go()}
          placeholder="Enter your password"
          style={{ marginBottom: err ? 8 : 20 }}
        />

        {err && <div className="err-box">{err}</div>}

        <button className="btn btn-blue" style={{ width: '100%', padding: 14, fontSize: 15, marginBottom: 12 }} onClick={go}>
          {mode === 'login' ? 'Log In' : 'Create Account'}
        </button>

        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
          <span onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setErr('') }}>
            {mode === 'login' ? 'Register' : 'Log in'}
          </span>
        </p>
      </div>
    </div>
  )
}
