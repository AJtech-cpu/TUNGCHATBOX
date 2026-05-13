import { useState } from 'react'
import { ROLE_ORDER, ROLE_COLOR, ROLE_ICON } from '../constants.js'
import { getRole, canMod, canAssign, uid } from '../utils/helpers.js'
import Avatar from './Avatar.jsx'
import RoleBadge from './RoleBadge.jsx'

export default function AdminPanel({ server, me, users, onClose, dispatch }) {
  const [target,  setTarget]  = useState('')
  const [newRole, setNewRole] = useState('mod')
  const [newCh,   setNewCh]   = useState('')
  const [addUser, setAddUser] = useState('')
  const [log,     setLog]     = useState([])

  const myRole = getRole(server, me.username)
  const push   = (msg, ok) => setLog(l => [{ msg, ok, id: uid() }, ...l].slice(0, 30))

  const resolve = (uname) => {
    const u = users.find(x => x.username.toLowerCase() === uname.toLowerCase())
    if (!u) { push(`User "${uname}" not found`, false); return null }
    return u
  }

  const act = (action) => {
    const t = target.trim()
    if (!t) return push('Enter a username first', false)
    if (t.toLowerCase() === me.username.toLowerCase()) return push("You can't target yourself", false)
    const u = resolve(t)
    if (!u) return
    const theirRole = getRole(server, u.username)
    if (!canMod(myRole, theirRole)) return push('Cannot moderate someone with equal or higher rank', false)
    dispatch(action, u.username, null, push)
  }

  const giveRole = () => {
    const t = target.trim()
    if (!t) return push('Enter a username first', false)
    if (t.toLowerCase() === me.username.toLowerCase()) return push("Can't target yourself", false)
    const u = resolve(t)
    if (!u) return
    if (!canMod(myRole, getRole(server, u.username))) return push('Cannot modify someone with equal or higher rank', false)
    if (!canAssign(myRole, newRole)) return push(`You cannot assign the ${newRole} role — your rank is not high enough`, false)
    dispatch('role', u.username, newRole, push)
  }

  const doAddUser = () => {
    const t = addUser.trim()
    if (!t) return
    const u = users.find(x => x.username.toLowerCase() === t.toLowerCase())
    if (!u) return push(`User "${t}" not found`, false)
    dispatch('add', u.username, null, push)
    setAddUser('')
  }

  const doAddChannel = () => {
    const name = newCh.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
    if (!name) return
    dispatch('addChannel', name, null, push)
    setNewCh('')
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal admin-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚙️ Admin Panel</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* ── Moderate ── */}
        <div className="admin-section">
          <div className="admin-section-title">Moderate User</div>
          <input className="form-input" value={target} onChange={e => setTarget(e.target.value)}
            placeholder="Type any username…" style={{ marginBottom: 10 }} />
          <div className="admin-actions">
            <button className="action-btn red"    onClick={() => act('ban')}>🚫 Ban</button>
            <button className="action-btn dark"   onClick={() => act('unban')}>↩️ Unban</button>
            <button className="action-btn orange" onClick={() => act('mute')}>🔇 Mute</button>
            <button className="action-btn dark"   onClick={() => act('unmute')}>🔊 Unmute</button>
            <button className="action-btn blue"   onClick={() => act('kick')}>👢 Kick</button>
          </div>
        </div>

        {/* ── Assign Role ── */}
        <div className="admin-section">
          <div className="admin-section-title">Assign Role (same username above)</div>
          <div className="role-picker">
            {['co-owner', 'admin', 'mod', 'member'].map(r => (
              <div key={r}
                className={`role-chip ${newRole === r ? 'selected' : ''} ${!canAssign(myRole, r) ? 'disabled' : ''}`}
                style={{ '--rc': ROLE_COLOR[r] }}
                onClick={() => canAssign(myRole, r) && setNewRole(r)}>
                {ROLE_ICON[r]} {r}
              </div>
            ))}
          </div>
          <button className="btn btn-green btn-sm" onClick={giveRole}>✓ Give Role</button>
        </div>

        {/* ── Add Member ── */}
        <div className="admin-section">
          <div className="admin-section-title">Add Member to Server</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="form-input" value={addUser} onChange={e => setAddUser(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doAddUser()}
              placeholder="Username to add…" style={{ marginBottom: 0, flex: 1 }} />
            <button className="btn btn-green" onClick={doAddUser}>Add</button>
          </div>
        </div>

        {/* ── Create Channel ── */}
        {['owner', 'co-owner', 'admin'].includes(myRole) && (
          <div className="admin-section">
            <div className="admin-section-title">Create Channel</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-input" value={newCh}
                onChange={e => setNewCh(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                onKeyDown={e => e.key === 'Enter' && doAddChannel()}
                placeholder="channel-name" style={{ marginBottom: 0, flex: 1 }} />
              <button className="btn btn-blue" onClick={doAddChannel}>Create</button>
            </div>
          </div>
        )}

        {/* ── Members List ── */}
        <div className="admin-section">
          <div className="admin-section-title">Members ({server.members.length}) — click to target</div>
          <div className="member-list-scroll">
            {server.members.map(u => (
              <div key={u} className="admin-member-row" onClick={() => setTarget(u)}>
                <Avatar name={u} size={26} />
                <span className="admin-member-name">{u}</span>
                <RoleBadge role={getRole(server, u)} />
                {server.muted.includes(u) && <span style={{ color: '#faa61a', fontSize: 11 }}>🔇</span>}
              </div>
            ))}
          </div>
        </div>

        {/* ── Banned List ── */}
        {server.banned.length > 0 && (
          <div className="admin-section">
            <div className="admin-section-title" style={{ color: '#f04747' }}>Banned ({server.banned.length}) — click to target</div>
            <div className="member-list-scroll">
              {server.banned.map(u => (
                <div key={u} className="admin-member-row banned" onClick={() => setTarget(u)}>
                  <Avatar name={u} size={26} />
                  <span style={{ color: '#f04747' }}>{u}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Action Log ── */}
        {log.length > 0 && (
          <div className="admin-log">
            {log.map(l => (
              <div key={l.id} className="log-line" style={{ color: l.ok ? '#43b581' : '#f04747' }}>
                {l.ok ? '✓' : '✗'} {l.msg}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
