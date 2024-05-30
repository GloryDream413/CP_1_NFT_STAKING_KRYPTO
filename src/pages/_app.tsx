import React, { FC } from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { CssBaseline, Typography } from '@mui/material'
import { EmotionCache } from '@emotion/cache'
import { CacheProvider, Global } from '@emotion/react'
import { createEmotionCache } from '@/utils'
import { MUIProvider } from '@/providers'
import 'slick-carousel/slick/slick.css'
import '@/styles/globals.css'
import '@/styles/react-slick.css'
import { NextPageWithLayout } from '@/interfaces/layout'

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

import { hooks as metaMaskHooks, metaMask } from "@/connectors/metaMask"
const connectors = [[metaMask, metaMaskHooks]];

import { GlobalLoading } from '@/myproviders/mylove';

////////////////// Loading provider //////////////////////

import { useContext } from 'react'
import { LoadingContext, LoadingProvider } from '@/myproviders/loading.context'
import { CircularProgress, Box } from '@mui/material';

////////////////// Loading provider //////////////////////

const clientSideEmotionCache = createEmotionCache()

type AppPropsWithLayout = AppProps & {
  emotionCache: EmotionCache
  Component: NextPageWithLayout
}


const App: FC<AppPropsWithLayout> = (props: AppPropsWithLayout) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  return (
    < CacheProvider value={emotionCache} >
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>React Coursespace</title>
      </Head>
      <MUIProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {
          // @ts-ignore
          <LoadingProvider>
            {/* <GlobalLoading /> */}
            <Web3ReactProvider connectors={connectors}>
              {getLayout(
                <Component {...pageProps} />
              )}
            </Web3ReactProvider>
          </LoadingProvider>
        }
      </MUIProvider>
    </CacheProvider >
  )
}

export default App
