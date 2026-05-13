import { useState, useRef, useEffect } from 'react'
import { ROLE_COLOR, ROLE_ICON } from '../constants.js'
import { getRole, hasPower, hashColor, fmtTime } from '../utils/helpers.js'
import Avatar from './Avatar.jsx'
import RoleBadge from './RoleBadge.jsx'
import AdminPanel from './AdminPanel.jsx'

export default function ChatRoom({ server, me, users, messages, onSend, onBack, dispatch }) {
  const [ch,        setCh]        = useState(server.channels[1]?.id || server.channels[0]?.id)
  const [input,     setInput]     = useState('')
  const [showAdmin, setShowAdmin] = useState(false)
  const [lightbox,  setLightbox]  = useState(null)
  const fileRef = useRef(null)
  const bottom  = useRef(null)

  const myRole  = getRole(server, me.username)
  const isMuted = server.muted.includes(me.username)
  const curCh   = server.channels.find(c => c.id === ch)
  const msgKey  = `${server.id}:${ch}`
  const msgs    = messages[msgKey] || []
  const canPost = !isMuted && !(curCh?.readOnly && !['owner', 'co-owner', 'admin'].includes(myRole))

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, ch])

  const send = () => {
    if (!input.trim() || !canPost) return
    onSend(server.id, ch, { type: 'text', content: input.trim() })
    setInput('')
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const isImg = file.type.startsWith('image/')
    const isVid = file.type.startsWith('video/')
    if (!isImg && !isVid) return alert('Only images and videos are supported.')
    if (file.size > 20 * 1024 * 1024) return alert('File must be under 20 MB.')
    const reader = new FileReader()
    reader.onload = ev => onSend(server.id, ch, { type: isImg ? 'image' : 'video', src: ev.target.result, name: file.name })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="app-layout">

      {/* ── Channel Sidebar ── */}
      <aside className="sidebar-channels">
        <div className="ch-header">
          <span>{server.icon}</span> {server.name}
          <div className="ch-header-meta">{server.members.length} members</div>
        </div>

        <div className="ch-list">
          <div className="ch-category">Text Channels</div>
          {server.channels.map(c => (
            <div key={c.id} className={`ch-row ${ch === c.id ? 'active' : ''}`} onClick={() => setCh(c.id)}>
              <span className="ch-hash">#</span>
              <span className="ch-name">{c.name}</span>
              {c.readOnly && <span className="ch-lock">🔒</span>}
            </div>
          ))}
        </div>

        <div className="user-bar">
          <div className="user-bar-avatar">
            <Avatar name={me.username} size={34} />
            <div className="status-dot" style={{ background: isMuted ? '#faa61a' : '#23a55a' }} />
          </div>
          <div className="user-bar-info">
            <div className="user-bar-name">{me.username}</div>
            <div className="user-bar-role" style={{ color: ROLE_COLOR[myRole] || '#72767d' }}>
              {ROLE_ICON[myRole]} {myRole.toUpperCase()} {isMuted ? '🔇' : ''}
            </div>
          </div>
          <button className="btn btn-gray btn-sm" title="Back to servers" onClick={onBack}>⊞</button>
        </div>
      </aside>

      {/* ── Messages Area ── */}
      <main className="chat-area">
        <div className="chat-header">
          <span className="chat-hash">#</span>
          <span className="chat-ch-name">{curCh?.name}</span>
          {curCh?.readOnly && <span className="chat-lock">🔒</span>}
          <div style={{ flex: 1 }} />
          {hasPower(myRole) && (
            <button className="btn btn-gray btn-sm" onClick={() => setShowAdmin(true)}>⚙️ Admin Panel</button>
          )}
        </div>

        <div className="messages">
          {msgs.length === 0 ? (
            <div className="empty-channel">
              <div className="empty-icon">👋</div>
              <div className="empty-title">Welcome to #{curCh?.name}!</div>
              <div className="empty-sub">This is the start of this channel. Say hello!</div>
            </div>
          ) : msgs.map((m, i) => {
            const prev    = msgs[i - 1]
            const grouped = prev && prev.author === m.author && (m.ts - prev.ts) < 300000
            return (
              <div key={m.id} className={`msg-row ${grouped ? 'grouped' : ''}`}>
                {!grouped
                  ? <Avatar name={m.author} size={40} />
                  : <div className="msg-gutter" />
                }
                <div className="msg-content">
                  {!grouped && (
                    <div className="msg-meta">
                      <span className="msg-author" style={{ color: hashColor(m.author) }}>{m.author}</span>
                      <RoleBadge role={getRole(server, m.author)} />
                      <span className="msg-time">{fmtTime(m.ts)}</span>
                    </div>
                  )}
                  {m.type === 'text'  && <p className="msg-text">{m.content}</p>}
                  {m.type === 'image' && (
                    <div>
                      {m.content && <p className="msg-text">{m.content}</p>}
                      <img src={m.src} alt={m.name || 'image'} className="msg-media"
                        onClick={() => setLightbox(m.src)} />
                    </div>
                  )}
                  {m.type === 'video' && (
                    <div>
                      {m.content && <p className="msg-text">{m.content}</p>}
                      <video src={m.src} className="msg-media" controls />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={bottom} />
        </div>

        <div className="input-wrap">
          {!canPost ? (
            <div className="input-blocked">
              {isMuted ? '🔇 You are muted in this server' : '🔒 Only admins can post in this channel'}
            </div>
          ) : (
            <div className="msg-box">
              <button className="attach-btn" title="Upload image or video" onClick={() => fileRef.current?.click()}>📎</button>
              <input type="file" ref={fileRef} accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFile} />
              <input
                type="text"
                className="msg-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder={`Message #${curCh?.name}`}
              />
              <button className="send-btn" style={{ color: input.trim() ? '#5865f2' : '#72767d' }} onClick={send}>➤</button>
            </div>
          )}
        </div>
      </main>

      {/* ── Members Panel ── */}
      <aside className="members-panel">
        <div className="members-title">Online — {server.members.length}</div>
        {server.members.map(u => (
          <div key={u} className="member-row">
            <div className="member-avatar-wrap">
              <Avatar name={u} size={32} />
              <div className="status-dot sm" style={{ background: server.muted.includes(u) ? '#faa61a' : '#23a55a' }} />
            </div>
            <div className="member-info">
              <div className="member-name">{u}</div>
              <RoleBadge role={getRole(server, u)} />
            </div>
          </div>
        ))}
        {server.banned.length > 0 && (
          <>
            <div className="members-title" style={{ color: '#f04747', marginTop: 16 }}>Banned — {server.banned.length}</div>
            {server.banned.map(u => (
              <div key={u} className="member-row" style={{ opacity: 0.5 }}>
                <Avatar name={u} size={32} />
                <span style={{ color: '#f04747', fontSize: 13 }}>🚫 {u}</span>
              </div>
            ))}
          </>
        )}
      </aside>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="overlay lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} className="lightbox-img" onClick={e => e.stopPropagation()} alt="full size" />
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
        </div>
      )}

      {/* ── Admin Panel ── */}
      {showAdmin && (
        <AdminPanel server={server} me={me} users={users} onClose={() => setShowAdmin(false)} dispatch={dispatch} />
      )}
    </div>
  )
}
