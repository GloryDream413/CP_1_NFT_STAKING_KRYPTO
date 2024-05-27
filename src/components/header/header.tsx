import React, { FC, useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Logo } from '@/components/logo'
import { Navigation, AuthNavigation } from '@/components/navigation'
import { useTheme } from '@mui/material/styles'
import { Menu, Close } from '@mui/icons-material'

const Header: FC = () => {
  const [visibleMenu, setVisibleMenu] = useState<boolean>(false)
  const { breakpoints } = useTheme()
  const matchMobileView = useMediaQuery(breakpoints.down('md'))

  return (
    <Box sx={{
      backgroundColor: '#1A1D1F',
      border: '2px solid #373A3B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: 3
    }}>
      <Logo />
      <Navigation />
    </Box>
  )
}

export default Header
