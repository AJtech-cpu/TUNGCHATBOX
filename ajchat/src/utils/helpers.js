import { PALETTE, ROLE_ORDER } from '../constants.js'

export const hashColor = (name) => {
  let h = 0
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff
  return PALETTE[h % PALETTE.length]
}

export const uid = () => Math.random().toString(36).slice(2) + Date.now()

export const roleRank  = (r)         => ROLE_ORDER.indexOf(r ?? 'member')
export const canMod    = (my, their) => roleRank(my) < roleRank(their)
export const canAssign = (my, role)  => roleRank(my) < roleRank(role)
export const getRole   = (srv, user) => srv?.roles?.[user] || 'member'
export const hasPower  = (r)         => ['owner','co-owner','admin','mod'].includes(r)

export const fmtTime = (ts) => {
  const d    = new Date(ts)
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return d.toDateString() === new Date().toDateString()
    ? `Today at ${time}`
    : `${d.toLocaleDateString()} ${time}`
}

export const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').slice(0, 32)
