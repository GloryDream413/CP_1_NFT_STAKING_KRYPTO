import { useContext } from 'react';
import { LoadingContext } from '@/myproviders/loading.context';

import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function MintInfoTable({ nftInfo }) {
    const { loading, setLoading } = useContext(LoadingContext);

    const [maxCollectionSupply, setMaxCollectionSupply] = React.useState<string>("");
    const [mintedNFTCount, setMintedNFTCount] = React.useState<string>("");
    const [mintCost, setMintCost] = React.useState<string>(0);
    const [maxMintAmountPerTx, setMaxMintAmountPerTx] = React.useState<string>(0);

    const fetchContractData = async () => {

        setLoading(true, "Fetching info");
        try {
            setMaxCollectionSupply(nftInfo.maxCollectionSupply);
            setMintedNFTCount(nftInfo.mintedNFTCount);
            setMintCost(nftInfo.mintCost);
            setMaxMintAmountPerTx(nftInfo.maxMintAmountPerTx);

        } catch (error) {
            console.error('Error fetching contract data:', error);
        }
        setLoading(false, "Fetching info", 1);
    };

    React.useEffect(() => {
        fetchContractData();
    }, [nftInfo]);

    return (
        <Box sx={{
            width: '100%',
            color: 'white',
            fontSize: '20px',
            // backgroundColor: 'rgba(52,163,185,0.5)',
            backgroundColor: 'rgba(255,0,0,0.2)',
            padding: '50px',
            borderRadius: '50px',
            '&:hover': {
                cursor: 'pointer',
                backgroundColor: 'rgba(52,163,185,0.3)',
            }
        }}>
            <Typography sx={{ color: 'white', textAlign: 'center' }} variant="h1">Minting Info</Typography>

            {/* Display the contract data */}
            <Grid container spacing={4} sx={{
                mt: 2, justifyContent: 'space-between', fontSize: '24px', fontWeight: '1000',
                '&:hover': { textDecoration: 'underline', textUnderlineOffset: '10px', cursor: 'pointer', }
            }}>
                <Grid item>Total Collection Supply</Grid>
                <Grid item>{maxCollectionSupply}</Grid>
            </Grid>

            <Grid container spacing={4} sx={{
                mt: 2, justifyContent: 'space-between', fontSize: '24px', fontWeight: '1000',
                '&:hover': { textDecoration: 'underline', textUnderlineOffset: '10px', cursor: 'pointer', }
            }}>
                <Grid item>Minted NFT Count</Grid>
                <Grid item>{mintedNFTCount}</Grid>
            </Grid>

            <Grid container spacing={4} sx={{
                mt: 2, justifyContent: 'space-between', fontSize: '24px', fontWeight: '1000',
                '&:hover': { textDecoration: 'underline', textUnderlineOffset: '10px', cursor: 'pointer', }
            }}>
                <Grid item>Mint Cost</Grid>
                <Grid item>{mintCost}</Grid>
            </Grid>

            <Grid container spacing={4} sx={{
                mt: 2, justifyContent: 'space-between', fontSize: '24px', fontWeight: '1000',
                '&:hover': { textDecoration: 'underline', textUnderlineOffset: '10px', cursor: 'pointer', }
            }}>
                <Grid item>Max Mint Amount Per Tx</Grid>
                <Grid item>{maxMintAmountPerTx}</Grid>
            </Grid>

            <Grid container spacing={4} sx={{
                mt: 2, justifyContent: 'center', '&:hover': {
                    textUnderlineOffset: '10px', cursor: 'pointer',
                }
            }}>
                <Grid item justifyContent='center'>
                    <Button color="success" variant="contained"
                        sx={{ mt: 2, width: '300px', fontSize: '20px', letterSpacing: '5px' }}
                    // onClick={fetchContractData}
                    >
                        Refresh
                    </Button>
                </Grid>
            </Grid>
        </Box >
    );
}