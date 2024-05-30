import { useContext } from 'react';
import { LoadingContext } from '@/myproviders/loading.context';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Image from 'next/image';

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// IMPORT for the minting.

import { ethers } from 'ethers';

import { nftContractAddress, stakingContractAddress, ownerAddress } from '@/contracts/utils/contract-config';
import nftContractABI from "../../contracts/abi/KryptoPunks.json"
import stakingContractABI from "../../contracts/abi/NFTStakingVault.json"

import { BigNumberish, Numeric } from 'ethers';

import { hooks } from "../../connectors/metaMask";
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } =
    hooks;

export default function MintNew({ nftInfo }) {
    const { loading, setLoading } = useContext(LoadingContext);

    const provider = useProvider();
    const userAccounts = useAccounts();
    const isActive = useIsActive();

    const totalCollectionSupply = '1000';
    const mintedNFTCount = '500';
    const mintCost = '0.05 ETH';

    const [maxMintAmountPerTx, setMaxMintAmountPerTx] = useState(0);

    const [perTx, setPerTx] = useState(1);

    const go_prev_cnt = () => {
        if (perTx > 1) {
            setPerTx(perTx - 1);
        }
    }

    const go_next_cnt = () => {
        if (perTx < maxMintAmountPerTx) {
            setPerTx(perTx + 1);
        }
    }

    const mintNewToken = async () => {
        setLoading(true, "Minting");
        if (!isActive) {
            window.alert("You have to connect wallet");
            setLoading(false, "Minting");
            return;
        }
        try {
            const userAddress = userAccounts?.[0];
            const nftContract = new ethers.Contract(nftContractAddress, nftContractABI, provider?.getSigner(0));

            let mint_tx;
            if (userAddress === ownerAddress) {
                mint_tx = await nftContract.mint(perTx);
            } else {
                const totalMintCost = ethers.parseEther(String(nftInfo.mintCost * perTx), "ether");
                mint_tx = await nftContract.mint(perTx, { value: totalMintCost });
            }
            setLoading(true, "Confirming");

            await provider.waitForTransaction(mint_tx.hash);
            await provider.getTransactionReceipt(mint_tx.hash);

            setLoading(false, "Confirming");
        } catch (error) {
            console.log(error);
            window.alert("Error while minting...");
        }
        setLoading(false, "Minting");
    };

    const fetchContractData = async () => {
        try {
            setMaxMintAmountPerTx(nftInfo.maxMintAmountPerTx);
        } catch (error) {
            console.error('Error fetching contract data:', error);
        }
    };

    useEffect(() => {
        fetchContractData();
    }, [nftInfo])

    return (
        <Box sx={{
            width: '100%',
            color: 'white',
            fontSize: '20px',
            backgroundColor: 'rgba(0,0,255,0.2)',
            padding: '50px',
            borderRadius: '50px',
            textAlign: 'center',
            justifyContent: 'center',

            '&:hover': {
                cursor: 'pointer',
                backgroundColor: 'rgba(0,0,255,0.3)'
            }
        }}>
            <Typography sx={{ color: 'white', textAlign: 'center', mb: 2, fontSize: '40px' }} variant="h1">Let's mint !</Typography>

            <Grid item sx={{ mt: 4 }}>
                <Image
                    src="/images/landing/nft_token.png"
                    width="200px"
                    height="200px"
                ></Image>
            </Grid>

            <Grid container alignItems='center' justifyContent='center' sx={{ mt: 4 }}>
                <Button color="secondary" onClick={go_prev_cnt} >
                    <RemoveCircleOutlineIcon />
                </Button>
                <TextField value={perTx}
                    inputProps={{ min: 0, style: { width: '100px', textAlign: 'center', color: 'white', fontSize: '20px' } }}> </TextField>
                <Button color="secondary" onClick={go_next_cnt}>
                    <AddCircleIcon />
                </Button>
            </Grid>

            <Button color="primary" variant="contained"
                sx={{ mt: 4, width: '300px', fontSize: '20px', letterSpacing: '5px' }}
                onClick={mintNewToken}>
                Mint new NFT
            </Button>
        </Box>
    );
}