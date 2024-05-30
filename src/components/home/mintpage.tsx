import { useContext } from 'react';
import { LoadingContext } from '@/myproviders/loading.context';

import React, { FC } from 'react'
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import RefreshIcon from '@mui/icons-material/Refresh';

import axios from "axios"

// Components for layout.
import MintInfoTable from './nft_mintinfo'
import StakingInfo from './nft_stakeinfo'
import MintNew from './nft_mint_new'
import MyNFTs from './nft_mine';

// Interact with Contact
import { ethers } from 'ethers';

// Meta informations
import { nftContractAddress, stakingContractAddress } from '@/contracts/utils/contract-config';
import nftContractABI from "../../contracts/abi/KryptoPunks.json"
import stakingContractABI from "../../contracts/abi/NFTStakingVault.json"

import { hooks } from "../../connectors/metaMask";
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } =
  hooks;

const MintPage: FC = () => {
  const { loading, setLoading } = useContext(LoadingContext);

  const userAccounts = useAccounts();
  const isActive = useIsActive();
  const provider = useProvider();

  const [info, setInfo] = useState({
    myKryptoPunks: [],
    itemsCount: 0,
    itemsStaked: [],
    earnedReward: "",

    maxCollectionSupply: "",
    mintedNFTCount: "",
    mintCost: 0,
    maxMintAmountPerTx: 1,

    paused: 1,
    userNFTs: []
  })

  const fetchContractData = async () => {
    setLoading(true, "Start Fetching");

    if (!isActive) {
      setInfo({
        myKryptoPunks: undefined,
        itemsCount: undefined,
        itemsStaked: undefined,
        earnedReward: undefined,

        maxCollectionSupply: undefined,
        mintedNFTCount: undefined,
        mintCost: undefined,
        maxMintAmountPerTx: undefined,

        paused: undefined,
        userNFTs: []
      })

      setLoading(false, "fetching returned cos of noActivation yet");
      return;
    }


    try {
      setLoading(true, 'Reading Contract');

      const userAddress = userAccounts?.[0];

      const nftContract = new ethers.Contract(nftContractAddress, nftContractABI, provider);
      const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractABI, provider);

      // Getting the staked tokens, user tokens

      let userTokens = Array.from((await nftContract.tokensOfOwner(userAddress)), x => Number(x));
      let stakedTokens = Array.from((await stakingContract.tokensOfOwner(userAddress)), x => Number(x));

      userTokens = userTokens.concat(stakedTokens);

      userTokens = [...userTokens].sort((a, b) => {
        return Number(a) > Number(b) ? 1 : -1;
      })


      console.log("after sort : ", userTokens);

      let baseURI = await nftContract.baseURI();
      let baseExtension = await nftContract.baseExtension();

      const _userNFTs = await Promise.all(userTokens.map(async (nft) => {
        const metadata = await axios.get(
          baseURI.replace("ipfs://", "https://ipfs.io/ipfs/") + "/" + nft.toString() + baseExtension
          // baseURI.replace("ipfs://", "https://ipfs.io/ipfs/") + "/" + nft.toString() + baseExtension
        )
        return {
          id: nft,
          uri: metadata.data.image.replace("ipfs://", "https://ipfs.io/ipfs/")
        }
      }))

      console.log("token urls : ", _userNFTs);

      let reward = await stakingContract.getTotalRewardEarned(userAddress);
      let _reward = ethers.formatEther(reward);

      // Getting the minting info

      const _maxCollectionSupply = await nftContract.maxSupply();
      const _mintedNFTCount = await nftContract.totalSupply();
      const _mintCost = await nftContract.cost();
      const _maxMintAmountPerTx = await nftContract.maxMintAmountPerTx();

      let __mintCost = ethers.formatEther(_mintCost);

      const _paused = await nftContract.paused();

      // Getting info for mint

      setInfo({
        myKryptoPunks: userTokens,
        itemsCount: userTokens.length,
        itemsStaked: stakedTokens,
        earnedReward: parseFloat(_reward).toFixed(3),

        maxCollectionSupply: _maxCollectionSupply.toString(),
        mintedNFTCount: _mintedNFTCount.toString(),
        mintCost: Number(__mintCost),
        maxMintAmountPerTx: Number(_maxMintAmountPerTx),

        paused: _paused,
        userNFTs: _userNFTs,
      })

      setLoading(false, "Fetching");

    } catch (error) {
      console.error('Error fetching contract data:', error);
    }
  };

  useEffect(() => {
    fetchContractData();
  }, [isActive])

  return (
    <Box id="hero" sx={{
      // backgroundColor: '#111315',
      position: 'relative',

      // height: '120%'
      backgroundImage: `url("https://wonderfulwebsites.com/wp-content/uploads/2022/08/web-design-hero.jpg")`,
      backgroundSize: 'cover',
      // backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: '100%',
      height: '800px'
    }}>

      <RefreshIcon
        sx={{
          width: '100px',
          height: '100px',
          position: 'fixed',
          right: '10px',
          top: '120px',
          color: 'yellow',
          '&:hover': {
            cursor: 'pointer',
            color: 'red',
            animation: 'rotate 1s ease-in-out 2',
          },
          '@keyframes rotate': {
            '0%': {
              transform: 'rotate(0deg)',
            },
            '100%': {
              transform: 'rotate(720deg)',
            },
          },
        }}
        onClick={fetchContractData}
      />


      {isActive ?
        (<Grid container>
          <Box sx={{
            width: '25%',
            marginLeft: '5%',
            paddingTop: '100px',
            paddingBottom: '5%'
          }}>
            <MintInfoTable nftInfo={info}></MintInfoTable>
          </Box>
          <Box sx={{
            width: '25%',
            marginLeft: '5%',
            paddingTop: '100px',
            paddingBottom: '5%'
          }}>
            <StakingInfo nftInfo={info}></StakingInfo>
          </Box>
          <Box sx={{
            width: '25%',
            marginLeft: '5%',
            paddingTop: '100px',
            paddingBottom: '5%'
          }}>
            <MintNew nftInfo={info}></MintNew>
          </Box>
        </Grid>) : (
          <Box>

          </Box>
        )
      }

      {isActive && (<Grid item container xs={12} md={12}>
        <MyNFTs nftInfo={info}></MyNFTs>
      </Grid>)}

    </Box >
  )
}

export default MintPage
