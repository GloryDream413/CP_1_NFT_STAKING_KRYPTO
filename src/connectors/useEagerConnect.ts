import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injected } from '../utils/connectors'

export default function useEagerConnect() {
  const { activate, active } = useWeb3React()

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          // intentionally do nothing
        })
      }
    })
  }, [activate]) // intentionally pass only activate to useEffect so it doesn't run again on subsequent renders

  return active
}
