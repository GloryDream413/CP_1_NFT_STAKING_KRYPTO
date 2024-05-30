import { useContext } from 'react';
import { LoadingContext } from '@/myproviders/loading.context';



import React, { FC } from 'react'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton, { iconButtonClasses } from '@mui/material/IconButton'

import ArrowForward from '@mui/icons-material/ArrowForward'
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CheckIcon from '@mui/icons-material/Check';

import { Course } from '@/interfaces/course'

import { hooks } from "../../connectors/metaMask";
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks;


// import for the contract interacting.

import { ethers } from 'ethers';
import { nftContractAddress, stakingContractAddress } from '@/contracts/utils/contract-config';
import nftContractABI from "../../contracts/abi/KryptoPunks.json"
import stakingContractABI from "../../contracts/abi/NFTStakingVault.json"

interface Props {
  item: Course,
  mode: boolean
}

const CourseCardItem: FC<Props> = ({ item, mode }) => {

  const { loading, setLoading } = useContext(LoadingContext);
  const provider = useProvider();

  const stakeItem = async (id: any) => {

    setLoading(true, "Staking");

    try {
      console.log('want to stake ? ', id);

      const nftContract = new ethers.Contract(nftContractAddress, nftContractABI, provider?.getSigner(0));
      const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractABI, provider?.getSigner(0));

      console.log('prepare to approve from stkaing contract...');
      const approve_tx = await nftContract.approve(stakingContractAddress, id);

      setLoading(true, "Approving");

      await provider.waitForTransaction(approve_tx.hash);
      await provider.getTransactionReceipt(approve_tx.hash);

      setLoading(false, "Approving");

      const ids = [id];
      console.log(ids);

      const stake_tx = await stakingContract.stake(ids);

      setLoading(true, "Confirming");

      await provider.waitForTransaction(stake_tx.hash);
      await provider.getTransactionReceipt(stake_tx.hash);

      setLoading(false, "Confirming");

    } catch (error) {
      console.log(error);
      window.alert("Error while staking...");
    }

    setLoading(false, "Staking");
  }

  const unStakeItem = async (id: any) => {

    setLoading(true, "UnStaking");

    try {
      const nftContract = new ethers.Contract(nftContractAddress, nftContractABI, provider?.getSigner(0));
      const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractABI, provider?.getSigner(0));

      const ids = [id];
      console.log(ids);

      const stake_tx = await stakingContract.unstake(ids);

      setLoading(true, "Confirming");

      await provider.waitForTransaction(stake_tx.hash);
      await provider.getTransactionReceipt(stake_tx.hash);

      setLoading(false, "Confirming");

    } catch (error) {
      console.log(error);
      window.alert("Error while unstaking...");
    }

    setLoading(false, "UnStaking");
  }

  return (
    <Box
      sx={{
        px: 1,
        py: 4,
      }}
    >
      <Box
        sx={{
          p: 2,
          backgroundColor: 'background.paper',
          borderRadius: 4,
          transition: (theme) => theme.transitions.create(['box-shadow']),
          '&:hover': {
            boxShadow: 2,
            [`& .${iconButtonClasses.root}`]: {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: 2,
            },
          },
        }}
      >
        <Box
          sx={{
            lineHeight: 0,
            overflow: 'hidden',
            borderRadius: 3,
            mb: 2,
          }}
        >
          <img src={item.uri} width='100%' height='100%' alt={'Course ' + item.id} />
          {/* <Image src={`url(${item.uri})`} width={760} height={760} alt={'Course ' + item.id} /> */}
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography component="h2" variant="h5" sx={{ mb: 2, height: 56, overflow: 'hidden', fontSize: '1.2rem' }}>
            Token ID : {item.id}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }} justifyContent='space-between'>
            <Rating name="rating-course" value={5} max={5} sx={{ color: '#ffce31', mr: 1 }} readOnly />
            <Typography component="span" variant="h5">
              $(US)
            </Typography>


            {!mode ? (
              <Button color="success" variant="contained" sx={{ width: '100px', height: '50px', fontSize: '20px' }}
                onClick={() => { stakeItem(item.id) }}
              >
                Staking
              </Button>) : (
              <Button color="warning" variant="contained" sx={{ width: '100px', height: '50px', fontSize: '20px' }}
                onClick={() => { unStakeItem(item.id) }}
              >
                unStake
              </Button>
            )}

          </Box>

        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" color="primary.main">
              {item.id}00
            </Typography>
            <Typography variant="h6">/ $</Typography>
          </Box>
          <IconButton
            color="primary"
            sx={{ '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' } }}
          >
            <CheckIcon />
          </IconButton>
        </Box>
      </Box>
    </Box >
  )
}

export default CourseCardItem
