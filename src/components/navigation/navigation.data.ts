import type { Navigation } from '@/interfaces/navigation'

export const navigations: Navigation[] = [
  {
    label: 'Home',
    path: '/', // '/',
    isPublic : true
  },
  {
    label: 'NFT-Mint',
    path: '/mintPage', // '/mentors',
    isPublic : true
  },
  {
    label: 'Admin',
    path: '/admin', // '/mentors',
    isPublic : false
  },
]
