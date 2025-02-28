import { ChainKey } from '@/config/chains'
import { RootState } from '@/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ChainState {
  chainKey: ChainKey
}

const initialState: ChainState = {
  chainKey: ChainKey.ETHEREUM,
}

const chainSlice = createSlice({
  name: 'chain',
  initialState,
  reducers: {
    setChainKey(state, action: PayloadAction<ChainKey>) {
      state.chainKey = action.payload
    },
  },
})

export const selectChain = (state: RootState) => {
  return state.chain.chainKey
}
export const { setChainKey } = chainSlice.actions
export const chainReducer = chainSlice.reducer
