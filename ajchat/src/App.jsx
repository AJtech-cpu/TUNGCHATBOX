import { useState, useEffect } from 'react'
import { BAD_WORDS, SEED_USERS, SEED_SERVER, SEED_MESSAGES } from './constants.js'
import { LS } from './utils/storage.js'
import { uid, getRole, canMod, canAssign, roleRank } from './utils/helpers.js'
import LoadingScreen from './components/LoadingScreen.jsx'
import AuthScreen    from './components/AuthScreen.jsx'
import ServerSelect  from './components/ServerSelect.jsx'
import ChatRoom      from './components/ChatRoom.jsx'

export default function App() {
  const [loaded,   setLoaded]   = useState(false)
  const [users,    setUsers]    = useState(() => LS.get('tungchatbox_users',    SEED_USERS))
  const [servers,  setServers]  = useState(() => LS.get('tungchatbox_servers',  [SEED_SERVER]))
  const [messages, setMessages] = useState(() => LS.get('tungchatbox_messages', SEED_MESSAGES))
  const [me,       setMe]       = useState(null)
  const [curSrv,   setCurSrv]   = useState(null)

  // Persist everything
  useEffect(() => LS.set('tungchatbox_users',    users),    [users])
  useEffect(() => LS.set('tungchatbox_servers',  servers),  [servers])
  useEffect(() => LS.set('tungchatbox_messages', messages), [messages])

  // ── Auth ──────────────────────────────────────────────────────────────────
  const handleAuth = (mode, username, password, setErr) => {
    if (mode === 'login') {
      const u = users.find(x => x.username.toLowerCase() === username.toLowerCase() && x.password === password)
      if (!u) return setErr('Wrong username or password')
      setMe(u)
    } else {
      if (BAD_WORDS.some(w => username.toLowerCase().includes(w))) return setErr('Inappropriate username')
      if (!/^[a-zA-Z0-9_]+$/.test(username)) return setErr('Letters, numbers, and underscores only')
      if (username.length < 3)  return setErr('Username must be at least 3 characters')
      if (username.length > 20) return setErr('Username must be under 20 characters')
      if (password.length < 6)  return setErr('Password must be at least 6 characters')
      if (users.some(x => x.username.toLowerCase() === username.toLowerCase())) return setErr('Username already taken')
      const nu = { username, password }
      setUsers(p => [...p, nu])
      setMe(nu)
    }
  }

  // ── Servers ───────────────────────────────────────────────────────────────
  const handleCreate = (name, icon) => {
    const id  = 'srv_' + uid()
    const srv = {
      id, name, icon,
      ownerId:  me.username,
      members:  [me.username],
      banned:   [],
      muted:    [],
      roles:    { [me.username]: 'owner' },
      channels: [
        { id: 'ann', name: 'announcements', readOnly: true  },
        { id: 'gen', name: 'general',       readOnly: false },
        { id: 'ot',  name: 'off-topic',     readOnly: false },
      ]
    }
    setServers(p => [...p, srv])
    setCurSrv(id)
  }

  const handleJoin = (srvId) => {
    setServers(p => p.map(s =>
      s.id === srvId && !s.banned.includes(me.username)
        ? { ...s, members: [...new Set([...s.members, me.username])],
                  roles:   { ...s.roles, [me.username]: s.roles[me.username] || 'member' } }
        : s
    ))
    setCurSrv(srvId)
  }

  const handleSelect = (srvId) => {
    const s = servers.find(x => x.id === srvId)
    if (!s || s.banned.includes(me.username)) return
    if (!s.members.includes(me.username)) handleJoin(srvId)
    else setCurSrv(srvId)
  }

  // ── Messages ──────────────────────────────────────────────────────────────
  const handleSend = (srvId, chId, data) => {
    const key = `${srvId}:${chId}`
    const msg = { id: uid(), author: me.username, ts: Date.now(), ...data }
    setMessages(p => ({ ...p, [key]: [...(p[key] || []), msg] }))
  }

  // ── Admin Dispatch ────────────────────────────────────────────────────────
  const dispatch = (action, targetUsername, extra, push) => {
    const srv = servers.find(s => s.id === curSrv)
    if (!srv) return push('Server not found', false)

    const myRole    = getRole(srv, me.username)
    const theirRole = getRole(srv, targetUsername)

    // ── Non-moderation actions ──
    if (action === 'add') {
      if (srv.banned.includes(targetUsername))   return push(`${targetUsername} is banned from this server`, false)
      if (srv.members.includes(targetUsername))  return push(`${targetUsername} is already a member`, false)
      setServers(p => p.map(s => s.id === curSrv
        ? { ...s,
            members: [...new Set([...s.members, targetUsername])],
            roles:   { ...s.roles, [targetUsername]: s.roles[targetUsername] || 'member' } }
        : s))
      return push(`${targetUsername} added to server`, true)
    }

    if (action === 'addChannel') {
      const name = targetUsername
      if (srv.channels.find(c => c.name === name)) return push(`#${name} already exists`, false)
      const cid = name + '_' + uid().slice(0, 6)
      setServers(p => p.map(s => s.id === curSrv
        ? { ...s, channels: [...s.channels, { id: cid, name, readOnly: false }] }
        : s))
      return push(`Created #${name}`, true)
    }

    // ── Rank check for all moderation ──
    if (!canMod(myRole, theirRole)) return push('Cannot moderate someone with equal or higher rank', false)

    if (action === 'ban') {
      setServers(p => p.map(s => s.id === curSrv
        ? { ...s, banned: [...new Set([...s.banned, targetUsername])], members: s.members.filter(m => m !== targetUsername) }
        : s))
      return push(`${targetUsername} has been banned`, true)
    }

    if (action === 'unban') {
      setServers(p => p.map(s => s.id === curSrv
        ? { ...s, banned: s.banned.filter(b => b !== targetUsername) }
        : s))
      return push(`${targetUsername} has been unbanned`, true)
    }

    if (action === 'mute') {
      setServers(p => p.map(s => s.id === curSrv
        ? { ...s, muted: [...new Set([...s.muted, targetUsername])] }
        : s))
      return push(`${targetUsername} has been muted`, true)
    }

    if (action === 'unmute') {
      setServers(p => p.map(s => s.id === curSrv
        ? { ...s, muted: s.muted.filter(m => m !== targetUsername) }
        : s))
      return push(`${targetUsername} has been unmuted`, true)
    }

    if (action === 'kick') {
      setServers(p => p.map(s => s.id === curSrv
        ? { ...s, members: s.members.filter(m => m !== targetUsername) }
        : s))
      return push(`${targetUsername} has been kicked`, true)
    }

    if (action === 'role') {
      const role = extra
      if (!canAssign(myRole, role)) return push(`You cannot assign the ${role} role — your rank is not high enough`, false)
      setServers(p => p.map(s => s.id === curSrv
        ? { ...s, roles: { ...s.roles, [targetUsername]: role } }
        : s))
      return push(`${targetUsername} is now ${role}`, true)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (!loaded) return <LoadingScreen onDone={() => setLoaded(true)} />
  if (!me)     return <AuthScreen onAuth={handleAuth} />

  const server = servers.find(s => s.id === curSrv)

  if (!server) return (
    <ServerSelect
      servers={servers}
      me={me}
      onSelect={handleSelect}
      onJoin={handleJoin}
      onCreate={handleCreate}
    />
  )

  return (
    <ChatRoom
      server={server}
      me={me}
      users={users}
      messages={messages}
      onSend={handleSend}
      onBack={() => setCurSrv(null)}
      dispatch={dispatch}
    />
  )
}
