import { ROLE_COLOR, ROLE_ICON } from '../constants.js'

export default function RoleBadge({ role }) {
  if (!role || role === 'member') return null
  return (
    <span className="role-badge" style={{ background: ROLE_COLOR[role] + '25', color: ROLE_COLOR[role] }}>
      {ROLE_ICON[role]} {role.toUpperCase()}
    </span>
  )
}
