import { useState } from 'react'
import { SERVER_ICONS } from '../constants.js'

export default function ServerSelect({ servers, me, onSelect, onJoin, onCreate }) {
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName]             = useState('')
  const [icon, setIcon]             = useState('🌐')

  const mine     = servers.filter(s => s.members.includes(me.username) && !s.banned.includes(me.username))
  const joinable = servers.filter(s => !s.members.includes(me.username) && !s.banned.includes(me.username))

  const create = () => {
    if (!name.trim()) return
    onCreate(name.trim(), icon)
    setShowCreate(false)
    setName('')
    setIcon('🌐')
  }

  return (
    <div className="srv-sel-wrap">
      <span className="srv-sel-logo">💬</span>
      <h1 className="srv-sel-title">TUNGCHATBOX</h1>
      <p className="srv-sel-credit">✨ made by: the one and only AJ himself ✨</p>

      <div className="srv-sel-content">
        {mine.length > 0 && (
          <>
            <div className="section-label">Your Servers</div>
            <div className="srv-grid">
              {mine.map(s => (
                <div key={s.id} className="srv-card" onClick={() => onSelect(s.id)}>
                  <div className="srv-card-icon">{s.icon}</div>
                  <div>
                    <div className="srv-card-name">{s.name}</div>
                    <div className="srv-card-meta">{s.members.length} members</div>
                    {s.ownerId === me.username && <div className="srv-card-owner">👑 Your server</div>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {joinable.length > 0 && (
          <>
            <div className="section-label" style={{ marginTop: 24 }}>Available to Join</div>
            <div className="srv-grid">
              {joinable.map(s => (
                <div key={s.id} className="srv-card" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div className="srv-card-icon">{s.icon}</div>
                    <div>
                      <div className="srv-card-name">{s.name}</div>
                      <div className="srv-card-meta">{s.members.length} members</div>
                    </div>
                  </div>
                  <button className="btn btn-blue btn-sm" onClick={() => onJoin(s.id)}>Join</button>
                </div>
              ))}
            </div>
          </>
        )}

        <button className="btn btn-blue" style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 24 }} onClick={() => setShowCreate(true)}>
          + Create a Server
        </button>
      </div>

      {showCreate && (
        <div className="overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Create a Server</h2>
            <p className="modal-sub">Pick an icon and give your server a name</p>

            <div className="icon-picker">
              {SERVER_ICONS.map(ic => (
                <div key={ic} className={`icon-option ${icon === ic ? 'selected' : ''}`} onClick={() => setIcon(ic)}>{ic}</div>
              ))}
            </div>

            <label className="form-label">Server Name</label>
            <input
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && create()}
              placeholder="My Awesome Server"
            />

            <div className="modal-actions">
              <button className="btn btn-gray" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-blue" onClick={create}>Create Server</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
