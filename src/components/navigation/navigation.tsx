import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { navigations } from './navigation.data';

import ConnectWallet from "./ConnectWallet";

const Navigation: FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {navigations.map(({ path: destination, label }) => (
        <Link key={destination} href={destination}>
          <Box
            component="a"
            sx={{
              position: 'relative',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '29px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: { xs: 0, md: 3 },
              mb: { xs: 3, md: 0 },
              ...(destination === '/' && {
                color: 'primary.main',
              }),

              '& > div': { display: 'none' },

              '&.current > div': { display: 'block' },

              '&:hover': {
                color: 'white',
                fontWeight: 'bold',
                fontSize: '30px',
                textDecoration: 'underline',
                textUnderlineOffset: '10px'
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                transform: 'rotate(3deg)',
                '& img': { width: 44, height: 'auto' },
              }}
            >
              <img src="/images/headline-curve.svg" alt="Headline curve" />
            </Box>
            {label}
          </Box>
        </Link>
      ))}

      <ConnectWallet />
    </Box>
  );
};

export default Navigation;