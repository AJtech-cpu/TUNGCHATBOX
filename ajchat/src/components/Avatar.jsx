import { hashColor } from '../utils/helpers.js'

export default function Avatar({ name, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: hashColor(name),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.38, flexShrink: 0
    }}>
      {name[0].toUpperCase()}
    </div>
  )
}
