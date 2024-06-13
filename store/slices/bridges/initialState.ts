import { BridgeKey } from '@/config/bridges'
import { ChainKey } from '@/config/chains'
import { TokenKey } from '@/config/token'

export interface BridgeMetric {
  value: string
  loading: boolean
}

export interface BridgeData {
  tvl: BridgeMetric
  apy: BridgeMetric
  error: string | null
  from: string
  to: string
  selectedToken: TokenKey
}

export type BridgesState = {
  data: { [bridgeKey in BridgeKey]: BridgeData }
  overallLoading: boolean
  sourceChain: ChainKey | null
  destinationChain: ChainKey | null
}

// Initialize the data object by iterating over all the bridge keys and setting the initial state
const initializeData = (): { [key in BridgeKey]: BridgeData } => {
  const data: { [key in BridgeKey]: BridgeData } = {} as any

  Object.values(BridgeKey).forEach((key) => {
    data[key] = {
      tvl: { value: BigInt(0).toString(), loading: false },
      apy: { value: BigInt(0).toString(), loading: false },
      error: null,
      from: '',
      to: '',
      selectedToken: TokenKey.ETH,
    }
  })

  return data
}

export const initialState: BridgesState = {
  data: initializeData(),
  overallLoading: true,
  sourceChain: null,
  destinationChain: null,
}
