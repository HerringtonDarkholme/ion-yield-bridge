import { BridgeKey, bridgesConfig } from '@/config/bridges'
import { setAddress } from '@/store/slices/account'
import { fetchBridgeApy, fetchBridgeRate, fetchBridgeTvl } from '@/store/slices/bridges/thunks'
import { fetchEthPrice } from '@/store/slices/price'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useGetAssetApysQuery } from '../slices/assetApys/api'
import { fetchLiquidityForAllMarkets } from '../slices/ionLens'
import { fetchCurrentBorrowRateForAllMarkets, fetchTotalSupplyForAllMarkets } from '../slices/ionPool'
import { selectNetApyEndTime } from '../slices/netApy'
import { useGetNetApyQuery } from '../slices/netApy/api'
import { useGetPositionsQuery } from '../slices/positions/api'
import { selectBridgeKey } from '../slices/router'

export function useStoreInitializer() {
  const dispatch = useAppDispatch()
  const { address } = useAccount()
  const startTime = 10_000 // 10 seconds after the epoch
  const endTime = useAppSelector(selectNetApyEndTime)

  const bridgeKey = useAppSelector(selectBridgeKey) as BridgeKey
  const vaultAddress = bridgesConfig[bridgeKey].contracts.boringVault

  // Loads all data
  // Although the backend api supports filtering by timeRange we will do it in the frontend
  // This will save on loading time and cache storage in the frontend
  useGetNetApyQuery({ address: vaultAddress, startTime, endTime })
  useGetPositionsQuery({ address: vaultAddress })
  useGetAssetApysQuery({})

  useEffect(() => {
    if (address) dispatch(setAddress(address))
  }, [address, dispatch])

  useEffect(() => {
    dispatch(fetchEthPrice())
    dispatch(fetchLiquidityForAllMarkets())
    dispatch(fetchTotalSupplyForAllMarkets())
    dispatch(fetchCurrentBorrowRateForAllMarkets())
    Object.values(BridgeKey).forEach((key) => {
      dispatch(fetchBridgeTvl(key))
      dispatch(fetchBridgeApy(key))
      dispatch(fetchBridgeRate(key))
    })
  }, [dispatch])
}
