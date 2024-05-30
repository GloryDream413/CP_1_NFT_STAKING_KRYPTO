import React, { FC, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { navigations } from './navigation.data';

import ConnectWallet from "./ConnectWallet";

// import for the contract interacting.
import { hooks } from "../../connectors/metaMask";
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks;

import { ethers } from 'ethers';
import { nftContractAddress, stakingContractAddress, ownerAddress } from '@/contracts/utils/contract-config';
import nftContractABI from "../../contracts/abi/KryptoPunks.json"
import stakingContractABI from "../../contracts/abi/NFTStakingVault.json"


const Navigation: FC = () => {
  const router = useRouter();

  const provider = useProvider();
  const userAccounts = useAccounts();

  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    setUserAddress(userAccounts?.[0]);
  }, [provider])

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {navigations.map(({ path: destination, label, isPublic }) => (
        (isPublic || userAccounts?.[0] == ownerAddress) && (
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
                  color: 'white',
                }),
                ...(destination === router.pathname && {
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '30px',
                  textDecoration: 'underline',
                  textUnderlineOffset: '10px'
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
          </Link>)
      ))}

      <ConnectWallet />
    </Box>
  );
};

export default Navigation;