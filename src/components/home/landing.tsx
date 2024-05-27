import React, { FC } from 'react'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { Link as ScrollLink } from 'react-scroll'
import { StyledButton } from '@/components/styled-button'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

const Landing: FC = () => {
  return (
    <Box id="hero" sx={{
      backgroundColor: '#111315',
      position: 'relative',
      width: '100%',
      // height: '120%'
      height: '100%'
    }}>
      <Image
        src="/images/landing/NFT_Background.jpg"
        width="100%"
        height="60%"
        layout='responsive'
        alt="Feature img" />
    </Box>
  )
}

export default Landing
