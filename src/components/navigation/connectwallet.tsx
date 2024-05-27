import { Button, styled } from '@mui/material';
import { useState } from 'react';

const ButtonContainer = styled(Button)(({ theme, walletConnected }) => ({
    backgroundColor: walletConnected ? '#ffd700' : '#2196f3',
    color: walletConnected ? '#2196f3' : '#ffd700',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
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
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request access to the user's MetaMask wallet
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                // Get the user's Ethereum address
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                const userAddress = accounts[0];
                setWalletAddress(userAddress);

                // Check if the user is connected to the correct network (BSC Testnet)
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                if (chainId !== '0x61') {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x61' }],
                    });
                }

                setWalletConnected(true);
            } catch (error) {
                console.error('Error connecting to wallet:', error);
                if (error.code === 4001) {
                    alert('Please connect your MetaMask wallet to continue.');
                } else {
                    alert('An error occurred while connecting your wallet. Please try again later.');
                }
            }
        } else {
            alert('Please install MetaMask to use this feature.');
        }
    };

    const disconnectWallet = async () => {
        setWalletConnected(false);
        setWalletAddress('');
    };

    const formatWalletAddress = (address) => {
        const firstChars = address.slice(0, 6);
        const lastChars = address.slice(-4);
        return `${firstChars}...${lastChars}`;
    };

    return (
        <ButtonContainer
            onClick={walletConnected ? disconnectWallet : connectWallet}
            walletConnected={walletConnected}
        >
            {walletConnected
                ? `Connected: ${formatWalletAddress(walletAddress)}`
                : 'Connect Wallet'}
        </ButtonContainer>
    );
};

export default ConnectButton;