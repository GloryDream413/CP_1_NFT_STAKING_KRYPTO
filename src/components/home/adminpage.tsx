import { useContext } from 'react';
import { LoadingContext } from '@/myproviders/loading.context';

import React, { FC, useState, useEffect } from 'react'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { Divider, TextField, Button, IconButton } from '@mui/material'

import InputAdornment from '@mui/material/InputAdornment';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CheckIcon from '@mui/icons-material/Check';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { alpha, styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';

import Switch from '@mui/material/Switch';

const PinkSwitch = styled(Switch)(({ theme }) => ({
  width: '70px',
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: pink[600],
    '&:hover': {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
    marginLeft: '20px'
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: pink[600],
  },
}));

const label = { inputProps: { 'aria-label': 'Color switch demo' } };


// Interact with Contact
import { ethers } from 'ethers';

// Meta informations
import { nftContractAddress, stakingContractAddress, ownerAddress } from '@/contracts/utils/contract-config';
import nftContractABI from "../../contracts/abi/KryptoPunks.json"
import stakingContractABI from "../../contracts/abi/NFTStakingVault.json"

import { hooks } from "../../connectors/metaMask";
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } =
  hooks;

const AdminPage: FC = () => {
  const { loading, setLoading } = useContext(LoadingContext);

  const provider = useProvider();
  const isActive = useIsActive();
  const userAccounts = useAccounts();

  console.log("_provider:", provider);
  console.log("isActive:", isActive);

  const [_currentBalance, setCurrentBalance] = useState(0);
  const [_maxMintAmountPerTx, setMaxMintAmountPerTx] = useState(1);
  const [_mintCost, setMintCost] = useState(0);
  const [_paused, setPaused] = useState(1);

  const [info, setInfo] = useState({
    currentBalance: 0,
    maxMintAmountPerTx: 1,
    mintCost: 0,
    paused: 1
  });

  const handleChangePerTx = (event) => {
    setMaxMintAmountPerTx(event.target.value);
  }

  const handleChangeMintCost = (event) => {
    setMintCost(event.target.value);
  }

  const handleSwitch = (event) => {
    setPaused(event.target.checked ? 2 : 1);
  }

  useEffect(() => {
    setCurrentBalance(info.currentBalance);
    setMaxMintAmountPerTx(info.maxMintAmountPerTx);
    setMintCost(info.mintCost);
    setPaused(info.paused);
  }, [info])

  const changePerTx = async () => {
    setLoading(true, "Changing PerTx");
    const userAddress = userAccounts?.[0];
    if (userAddress !== ownerAddress) {
      window.alert("Connect Wallet");
      return;
    }
    const myLimit = 11;
    if (_maxMintAmountPerTx < 1 || _maxMintAmountPerTx > myLimit) {
      window.alert("MaxPerTransaction Limit Error");
      return;
    }
    try {
      const nftContract = new ethers.Contract(nftContractAddress, nftContractABI, provider?.getSigner(0));
      const _tx = await nftContract.setMaxMintAmountPerTx(_maxMintAmountPerTx);


      setLoading(true, "Confirming");

      await provider.waitForTransaction(_tx.hash);
      await provider.getTransactionReceipt(_tx.hash);

      setLoading(false, "Confirming");

    } catch (error) {
      console.log(error);
    }
    setLoading(false, "Changing PerTx");
  }

  const handleWithdraw = async () => {
    setLoading(true, "Withdrawing");

    const userAddress = userAccounts?.[0];
    if (userAddress !== ownerAddress) {
      window.alert("Connect Wallet");
      return;
    }

    try {
      const nftContract = new ethers.Contract(nftContractAddress, nftContractABI, provider?.getSigner(0));
      const _tx = await nftContract.withdraw();

      setLoading(true, "Confirming");

      await provider.waitForTransaction(_tx.hash);
      await provider.getTransactionReceipt(_tx.hash);

      setLoading(false, "Confirming");

    } catch (error) {
      console.log(error);
    }
    setLoading(false, "Withdrawing");
  }


  const applySwitch = async () => {
    setLoading(true, "Switching");
    const userAddress = userAccounts?.[0];
    if (userAddress !== ownerAddress) {
      window.alert("Connect Wallet");
      return;
    }

    if (_paused == info.paused) {
      window.alert("Contract status is still " + (_paused == 1 ? "paused" : "active") + " now ... ");
      return;
    }

    try {
      const nftContract = new ethers.Contract(nftContractAddress, nftContractABI, provider?.getSigner(0));
      const _tx = await nftContract.pause(_paused);

      setLoading(true, "Confirming");

      await provider.waitForTransaction(_tx.hash);
      await provider.getTransactionReceipt(_tx.hash);

      setLoading(false, "Confirming");

    } catch (error) {
      console.log(error);
    }
    setLoading(false, "Switching");
  }


  const changeMintCost = async () => {
    setLoading(true, "Changing MintCost");
    const userAddress = userAccounts?.[0];
    if (userAddress !== ownerAddress) {
      window.alert("Connect Wallet");
      return;
    }
    const myLimit = 11;
    if (_mintCost < 0) {
      window.alert("Input correct Mint Cost");
      return;
    }
    try {
      const nftContract = new ethers.Contract(nftContractAddress, nftContractABI, provider?.getSigner(0));

      const _cost = ethers.parseEther(_mintCost, "ether");

      const _tx = await nftContract.setCost(_cost);

      setLoading(true, "Confirming");

      await provider.waitForTransaction(_tx.hash);
      await provider.getTransactionReceipt(_tx.hash);

      setLoading(false, "Confirming");
    } catch (error) {
      console.log(error);
    }
    setLoading(false, "Changing MintCost");
  }

  const fetchContractData = async () => {
    console.log('Fetching informations');

    if (provider == undefined) return;

    console.log('Fetching informations');
    try {
      const nftContract = new ethers.Contract(nftContractAddress, nftContractABI, provider?.getSigner(0));
      // const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractABI, provider?.getSigner(0));

      // I can't understand this now.
      let _balance = await provider.getBalance(nftContractAddress);
      let _maxMintAmountPerTx = await nftContract.maxMintAmountPerTx();
      let _mintCost = await nftContract.cost();
      let _paused = await nftContract.paused();

      console.log('Getting informations');

      console.log(_balance);
      console.log(_maxMintAmountPerTx);
      console.log(_mintCost);
      console.log(_paused);

      console.log('Getting informations');

      setInfo({
        currentBalance: Number(_balance),
        maxMintAmountPerTx: Number(_maxMintAmountPerTx),
        mintCost: Number(ethers.formatEther(_mintCost)),
        paused: Number(_paused)
      });

    } catch (error) {
      console.error('Error while getting information from admin', error);
      window.alert(error);
    }
  }

  useEffect(() => {
    console.log("_useeffect_provider:", provider);
    fetchContractData();
  }, [isActive]);

  return (
    <Box id="hero" sx={{
      backgroundColor: '#111315',
      position: 'relative',
      backgroundImage: "url('/images/backgrounds/6.jpg')",
      backgroundSize: 'cover',
      backgroundRepeat: 'repeat',
      backgroundPosition: 'center',
      width: '100%',
      height: '1200px',
    }}>
      <Box sx={{
        position: 'absolute',
        left: '35%',
        top: '10%',
        width: '30%',
        height: '750px',
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: '20px',
      }}>


        <Grid container direction="column">
          <Grid item sx={{
            textAlign: 'center'
          }}>
            <Typography component="h1"
              variant="h1"
              sx={{
                mb: 2, height: 56, fontSize: '36px',
                color: 'white',
                mt: -9,
                letterSpacing: '5px'
              }}>
              ADMIN CONTROL
            </Typography>
          </Grid>

          <Grid item container direction="column" sx={{
            height: '350px',
            textAlign: 'center',
          }} alignItems='center' justifyContent='center' >
            <Avatar src="/images/avatars/avatar.jpg" sx={{
              width: '200px',
              height: '200px',
              border: '1px solid pink'
            }} />
            <Typography component="h1"
              variant="h1"
              sx={{
                mt: 2, height: 56, fontSize: '22px',
                color: 'purple',
                letterSpacing: '5px'
              }}>
              KJS Rothschild
            </Typography>

            <Divider width='95%' sx={{
              border: '1px solid white',
            }} />
          </Grid>

          <Grid item container
            direction="row"
            alignItems='center'
            justifyContent='space-between'
            sx={{
              px: '10px', my: '15px', height: '60px',
              '&:hover': {
                backgroundColor: 'rgba(0,128,128,0.4)',
                cursor: 'pointer',
                borderRadius: '20px'
              }
            }}>

            <Grid item sx={{ mr: 'auto', ml: 2 }}>
              <Typography component="h1"
                variant="h1"
                sx={{
                  fontSize: '20px',
                  color: 'white',
                  letterSpacing: '1px'
                }}>
                Current Balance :
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                error
                id="outlined-error"
                label=""
                sx={{
                  "& .MuiInputBase-input": {
                    textAlign: 'center',

                    fontSize: 20, width: '100px', height: 30,
                    padding: 0.5,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    // border: '2px solid lightblue',
                    color: 'white'
                  },
                }}
                value={_currentBalance}
              ></TextField>
            </Grid>

            <Grid item>
              <Button color="error" variant="contained"
                sx={{ ml: 2, width: '100px' }}
                onClick={handleWithdraw}
              >Withdraw</Button>
            </Grid>
          </Grid>


          <Grid item container
            direction="row"
            alignItems='center'
            justifyContent='space-between'
            sx={{
              px: '10px', my: '15px', height: '60px',
              '&:hover': {
                backgroundColor: 'rgba(0,128,128,0.4)',
                cursor: 'pointer',
                borderRadius: '20px'
              }
            }}>

            <Grid item sx={{ mr: 'auto', ml: 2 }}>
              <Typography component="h1"
                variant="h1"
                sx={{
                  fontSize: '20px',
                  color: 'white',
                  letterSpacing: '1px'
                }}>
                Max-Per-Transaction :
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                error
                id="outlined-error"
                label=""
                sx={{
                  "& .MuiInputBase-input": {
                    textAlign: 'center',

                    fontSize: 20, width: '100px', height: 30,
                    padding: 0.5,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    // border: '2px solid lightblue',
                    color: 'white',
                  },
                }}
                onChange={handleChangePerTx}
                value={_maxMintAmountPerTx}
              >
              </TextField>
            </Grid>

            <Grid item>
              <Button color="success" variant="contained"
                sx={{ ml: 2, width: '100px', letterSpacing: '2px' }}
                onClick={changePerTx}
              >Change</Button>
            </Grid>
          </Grid>


          <Grid item container
            direction="row"
            alignItems='center'
            justifyContent='space-between'
            sx={{
              px: '10px', my: '15px', height: '60px',
              '&:hover': {
                backgroundColor: 'rgba(0,128,128,0.4)',
                cursor: 'pointer',
                borderRadius: '20px'
              }
            }}>

            <Grid item sx={{ mr: 'auto', ml: 2 }}>
              <Typography component="h1"
                variant="h1"
                sx={{
                  fontSize: '20px',
                  color: 'white',
                  letterSpacing: '1px'
                }}>
                NFT Mint Cost :
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                error
                id="outlined-error"
                label=""
                sx={{
                  "& .MuiInputBase-input": {
                    textAlign: 'center',

                    fontSize: 20, width: '100px', height: 30,
                    padding: 0.5,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    // border: '2px solid lightblue',
                    color: 'white'
                  },
                }}
                onChange={handleChangeMintCost}

                value={_mintCost}
              ></TextField>
            </Grid>

            <Grid item>
              <Button color="secondary" variant="contained"
                sx={{ ml: 2, width: '100px', letterSpacing: '2px' }}
                onClick={changeMintCost}
              >Change</Button>
            </Grid>
          </Grid>


          <Grid item container
            direction="row"
            alignItems='center'
            justifyContent='space-between'
            sx={{
              px: '10px', my: '15px', height: '60px',
              '&:hover': {
                backgroundColor: 'rgba(0,128,128,0.4)',
                cursor: 'pointer',
                borderRadius: '20px'
              }
            }}>

            <Grid item sx={{ mr: 'auto', ml: 2 }}>
              <Typography component="h1"
                variant="h1"
                sx={{
                  fontSize: '20px',
                  color: 'white',
                  letterSpacing: '1px'
                }}>
                Contract Status :
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                error
                id="outlined-error"
                label=""
                sx={{
                  "& .MuiInputBase-input": {
                    textAlign: 'center',

                    fontSize: 20,
                    width: '100px',
                    height: 30,
                    padding: 0.5,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    // border: '2px solid lightblue',
                    color: _paused === 2 ? "white" : "gray"
                  }
                }}
                value={_paused === 2 ? "Active" : "Paused"}
              />
            </Grid>

            <Grid item sx={{ ml: 2 }}>
              {/* <Button color="success" variant="contained"
                sx={{ ml: 2, width: '100px' }}>Withdraw</Button> */}
              <Switch {...label} defaultChecked={info.paused == 2 ? true : false}
                checked={_paused == 2 ? true : false}
                color='error'
                onChange={handleSwitch}
              // onClick={handleSwitch}
              />
              <IconButton
                color="primary"
                sx={{
                  marginLeft: '15px',
                  backgroundColor: 'black',
                  width: '30px',
                  height: '30px',
                  '&:hover': { backgroundColor: 'red', color: 'primary.contrastText' }
                }}
                onClick={applySwitch}
              >
                <CheckIcon />
              </IconButton>
            </Grid>
          </Grid>

          <Divider width='95%' sx={{
            border: '1px solid rgba(255,255,255,0.4)',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '2.5%'
          }} />
        </Grid>

      </Box >
    </Box >
  )
}

export default AdminPage
