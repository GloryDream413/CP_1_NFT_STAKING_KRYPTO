import React, { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import { GlobalLoading } from '@/myproviders/mylove'

interface Props {
  children: ReactNode
}

const MainLayout: FC<Props> = ({ children }) => {
  return (
    <Box component="main">
      <GlobalLoading />
      <Header />
      {children}
      {/* <Footer /> */}
    </Box>
  )
}

export default MainLayout
