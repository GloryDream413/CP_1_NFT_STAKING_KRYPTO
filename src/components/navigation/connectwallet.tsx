import { useContext } from 'react';
import { LoadingContext } from '@/myproviders/loading.context';

import { Button, styled } from '@mui/material';
import { useState, useEffect } from 'react';
import { useWeb3React } from "@web3-react/core";
import { hooks } from "../../connectors/metaMask";

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } =
    hooks;

const ButtonContainer = styled(Button)(({ theme, flag }) => ({
    backgroundColor: flag == 'Connect wallet' ? '#ffd700' : '#2196f3',
    color: flag == 'Connect wallet' ? '#2196f3' : '#ffd700',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    marginLeft: '10px',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundImage: 'linear-gradient(45deg, #00FFFF, #00FF00, #FFFF00, #FF00FF, #00FFFF)',
        backgroundSize: '200% 200%',
        animation: 'gradient 10s ease infinite',
    },
    '@keyframes gradient': {
        '0%': {
            backgroundPosition: '0% 50%',
        },
        '50%': {
            backgroundPosition: '100% 50%',
        },
        '100%': {
            backgroundPosition: '0% 50%',
        },
    },
}));

const ConnectButton = () => {

    const { loading, setLoading } = useContext(LoadingContext);
    const [walletAddress, setWalletAddress] = useState('');
    const { connector } = useWeb3React();
    const provider = useProvider();
    const accounts = useAccounts();
    const isActivating = useIsActivating();
    const isActive = useIsActive();

    const [connectionState, setConnectionState] = useState(getConnectionStateAsString())

    useEffect(() => {
        setConnectionState(getConnectionStateAsString());
    }, [isActivating, isActive])

    const connectWallet = async () => {
        setLoading(true, "Connecting Wallet");

        if (!isActive && !isActivating) {
            setLoading(true, "Activating");
            await connector.activate(97);
            setLoading(false, "Activating");
        } else if (!isActivating) {

            if (connector?.deactivate) {
                setLoading(true, "Activating");
                await connector.deactivate();
                setLoading(false, "Activating");
            } else {
                setLoading(true, "Disconnecting");
                await connector.resetState();
                setLoading(false, "Disconnecting");
            }
        }
        setLoading(false, "Connecting Wallet");
    };

    function getConnectionStateAsString() {
        if (isActivating)
            return ('Connecting...')
        else if (!isActive)
            return ('Connect wallet')
        else
            return ('Disconnect')
    }

    return (
        <ButtonContainer
            onClick={connectWallet}
            flag={connectionState}
        >
            {connectionState}
        </ButtonContainer>
    );
};

export default ConnectButton;