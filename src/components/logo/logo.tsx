import React, { FC } from 'react'
import { Box, Typography } from '@mui/material'

interface Props {
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

const Logo: FC<Props> = ({ onClick, variant }) => {
  return (
    <Box onClick={onClick}>
      <Typography
        component="h1"
        sx={{
          color: 'white',
          fontSize: '32px',
          width: '300px',
          letterSpacing: '5px'
        }}
      // sx={{ fontWeight: 700, '& span': { color: variant === 'primary' ? 'primary.main' : 'unset' } }}
      >
        NFT-Staking
      </Typography>
    </Box>
  )
}

Logo.defaultProps = {
  variant: 'primary',
}

export default Logo
