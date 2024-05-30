// // 'use client'

// import { Web3ReactProvider } from '@web3-react/core'
// import { Web3Provider } from '@ethersproject/providers'

// import { hooks as metaMaskHooks, metaMask } from "@/connectors/metaMask"
// const connectors = [[metaMask, metaMaskHooks]];


// function getLibrary(provider: any): Web3Provider {
//     const library = new Web3Provider(provider)
//     library.pollingInterval = 12000
//     return library
// }

// export default function Web3ReactProviderApp({ pageProps }) {
//     return (
//         <Web3ReactProvider connectors={connectors} getLibrary={getLibrary}>
//             <Component {...pageProps} />
//         </Web3ReactProvider>
//     )
// }
