import { wagmiConfig } from '@/config/wagmi'
import { RootState } from '@/store'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { readContract } from '@wagmi/core'
import { Abi, erc20Abi } from 'viem'
import { setErrorMessage } from '../status'
import Chainlink from '@/contracts/Chainlink.json'
import { contractAddresses } from '@/config/contracts'

export interface FetchPriceResult {
  price: string
}

/**
 * Fetches the price of ETH using the Chainlink oracle.
 *
 * @returns A promise that resolves to the fetched price.
 */
export const fetchEthPrice = createAsyncThunk<FetchPriceResult, void, { rejectValue: string; state: RootState }>(
  'price/fetchEthPrice',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const result = (await readContract(wagmiConfig, {
        abi: Chainlink.abi as Abi,
        address: contractAddresses.chainlink,
        functionName: 'latestRoundData',
        args: [],
      })) as Array<bigint>

      const ethPrice = result[1] as bigint
      return { price: ethPrice.toString() }
    } catch (e) {
      const error = e as Error
      const errorMessage = 'Failed to fetch WeETH balance.'
      const fullErrorMessage = `${errorMessage}\n${error.message}`
      console.error(fullErrorMessage)
      dispatch(setErrorMessage(fullErrorMessage))
      return rejectWithValue(errorMessage)
    }
  }
)
