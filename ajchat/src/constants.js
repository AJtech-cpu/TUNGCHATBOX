export const BAD_WORDS = [
  'fuck','shit','bitch','asshole','nigger','nigga','cunt','dick',
  'cock','pussy','whore','slut','faggot','retard','kys','bastard'
]

export const PALETTE = [
  '#f04747','#faa61a','#43b581','#7289da','#1abc9c',
  '#e91e63','#ff5722','#9c27b0','#3498db','#e67e22','#2ecc71','#00b0f4'
]

export const ROLE_ORDER = ['owner','co-owner','admin','mod','member']

export const ROLE_COLOR = {
  owner: '#f04747',
  'co-owner': '#e67e22',
  admin: '#faa61a',
  mod: '#43b581',
  member: '#72767d'
}

export const ROLE_ICON = {
  owner: '👑',
  'co-owner': '🔱',
  admin: '⚡',
  mod: '🛡️',
  member: ''
}

export const SERVER_ICONS = [
  '🌐','🎮','🎵','🎨','💼','⚡','🔥','🌟',
  '🏆','🎯','🚀','💎','🐉','⚔️','🎪','🌈'
]

export const SEED_USERS = [
  { username: 'A0X0J', password: '67G0DOWNER' }
]

const now = Date.now()

export const SEED_SERVER = {
  id: 'main',
  name: "AJ's Server",
  icon: '🌐',
  ownerId: 'A0X0J',
  members: ['A0X0J'],
  banned: [],
  muted: [],
  roles: { 'A0X0J': 'owner' },
  channels: [
    { id: 'ann',  name: 'announcements', readOnly: true  },
    { id: 'gen',  name: 'general',       readOnly: false },
    { id: 'ot',   name: 'off-topic',     readOnly: false },
    { id: 'gm',   name: 'gaming',        readOnly: false },
    { id: 'mm',   name: 'memes',         readOnly: false },
    { id: 'mu',   name: 'music',         readOnly: false },
  ]
}

export const SEED_MESSAGES = {
  'main:ann': [
    { id: 'm1', author: 'A0X0J', type: 'text', content: '👑 Welcome to the server! This is the official announcements channel.', ts: now - 86400000 }
  ],
  'main:gen': [
    { id: 'm2', author: 'A0X0J', type: 'text', content: "Hey everyone! Welcome to AJ's server 🎉 Feel free to chat!", ts: now - 3600000 }
  ]
}
