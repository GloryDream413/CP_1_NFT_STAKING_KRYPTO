import { useContext } from 'react';
import { LoadingContext } from '@/myproviders/loading.context';



import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// import for the contract interacting.
import { ethers } from 'ethers';
import { nftContractAddress, stakingContractAddress } from '@/contracts/utils/contract-config';
import nftContractABI from "../../contracts/abi/KryptoPunks.json"
import stakingContractABI from "../../contracts/abi/NFTStakingVault.json"

import { hooks } from "../../connectors/metaMask";
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks;

export default function StakingInfo({ nftInfo }) {
    const { loading, setLoading } = useContext(LoadingContext);

    const provider = useProvider();

    const [myKryptoPunks, setMyKryptoPunks] = useState([]);
    const [itemsCount, setItemsCount] = useState(0);
    const [itemsStaked, setItemsStaked] = useState([]);
    const [earnedReward, setEarnedReward] = useState("");

    const fetchContractData = async () => {
        try {
            setMyKryptoPunks(nftInfo.myKryptoPunks);
            setItemsCount(nftInfo.itemsCount);
            setItemsStaked(nftInfo.itemsStaked);
            setEarnedReward(nftInfo.earnedReward);
        } catch (error) {
            console.error('Error fetching contract data:', error);
        }
    };

    useEffect(() => {
        fetchContractData();
    }, [nftInfo])

    const formatArray = (arr) => {

        if (arr == undefined) return '[]';

        let rslt = '[ ';

        arr.forEach(cur => {
            rslt += cur + ' ';
        })

        return rslt + ']';
    }


    const handleClaim = async () => {

        setLoading(true, "Claiming");

        try {
            const nftContract = new ethers.Contract(nftContractAddress, nftContractABI, provider?.getSigner(0));
            const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractABI, provider?.getSigner(0));

            const stake_tx = await stakingContract.claim(nftInfo.itemsStaked);


            setLoading(true, "Confirming");

            await provider.waitForTransaction(stake_tx.hash);
            await provider.getTransactionReceipt(stake_tx.hash);

            setLoading(false, "Confirming");

        } catch (error) {
            console.log(error);
            window.alert("Error while Claiming...");
        }
        setLoading(false, "Claiming");
    }

    const unStakeAll = async () => {
        setLoading(true, "Unstaking All");
        try {
            const nftContract = new ethers.Contract(nftContractAddress, nftContractABI, provider?.getSigner(0));
            const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractABI, provider?.getSigner(0));

            const stake_tx = await stakingContract.unstake(nftInfo.itemsStaked);

            await provider.waitForTransaction(stake_tx.hash);
            await provider.getTransactionReceipt(stake_tx.hash);

        } catch (error) {
            console.log(error);
            window.alert("Error while unstaking...");
        }
        setLoading(false, "Unstaking All");
    }

    return (
        <Box sx={{
            width: '100%',
            color: 'white',
            fontSize: '20px',
            // backgroundColor: 'rgba(52,163,185,0.5)',
            backgroundColor: 'rgba(0,255,0,0.2)',
            padding: '50px',
            borderRadius: '50px',
            '&:hover': {
                cursor: 'pointer',
                backgroundColor: 'rgba(0,255,0,0.3)',
            }

        }}>
            <Typography sx={{ color: 'white', textAlign: 'center' }} variant="h1">
                Staking Info
            </Typography>

            <Grid container spacing={4} sx={{
                mt: 2,
                justifyContent: 'space-between',
                fontWeight: '1000',
                fontSize: '24px',

                '&:hover': {
                    textDecoration: 'underline',
                    textUnderlineOffset: '10px',
                    cursor: 'pointer',
                    color: 'yellow'
                }

            }}>
                <Grid item>
                    Mine
                </Grid>
                <Grid item>
                    {formatArray(myKryptoPunks)}
                </Grid>
            </Grid>

            <Grid container spacing={4} sx={{
                mt: 2,
                justifyContent: 'space-between',
                fontWeight: '1000',
                fontSize: '24px',

                '&:hover': {
                    textDecoration: 'underline',
                    textUnderlineOffset: '10px',
                    cursor: 'pointer',
                    color: 'yellow'
                }

            }}>
                <Grid item>
                    Items Count
                </Grid>
                <Grid item>
                    {itemsCount}
                </Grid>
            </Grid>

            <Grid container spacing={4} sx={{
                mt: 2,
                justifyContent: 'space-between',
                fontWeight: '1000',
                fontSize: '24px',

                '&:hover': {
                    textDecoration: 'underline',
                    textUnderlineOffset: '10px',
                    cursor: 'pointer',
                    color: 'yellow'
                }

            }}>
                <Grid item>
                    Items Staked
                </Grid>
                <Grid item>
                    {formatArray(itemsStaked)}
                </Grid>
            </Grid>

            <Grid container spacing={4} sx={{
                mt: 2,
                justifyContent: 'space-between',
                fontWeight: '1000',
                fontSize: '24px',

                '&:hover': {
                    textDecoration: 'underline',
                    textUnderlineOffset: '10px',
                    cursor: 'pointer',
                    color: 'yellow'
                }

            }}>
                <Grid item>
                    Earned Reward
                </Grid>
                <Grid item>
                    {earnedReward}
                </Grid>
            </Grid>

            <Grid container spacing={4} sx={{
                mt: 2,
                justifyContent: 'space-between',
                fontWeight: '1000',
                fontSize: '24px',

                '&:hover': {
                    textDecoration: 'underline',
                    textUnderlineOffset: '10px',
                    cursor: 'pointer',
                    color: 'yellow'
                }

            }}>
                <Grid item>
                    <Button color="info" variant="contained"
                        sx={{ mt: 2, width: '100px', fontSize: '20px', letterSpacing: '5px' }}
                        onClick={handleClaim}>
                        Claim
                    </Button>
                </Grid>
                <Grid item>
                    <Button color="warning" variant="contained"
                        sx={{ mt: 2, width: '250px', fontSize: '20px', letterSpacing: '1px' }}
                        onClick={unStakeAll}>
                        UnStake All
                    </Button>
                </Grid>
            </Grid>

        </Box>
    );
}