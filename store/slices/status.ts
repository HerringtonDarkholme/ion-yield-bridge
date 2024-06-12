import { RootState } from '@/store'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { selectWeEthBalanceLoading } from './balance'
import { selectPriceLoading } from './price'

interface StatusState {
  error: string | null
}

const initialState: StatusState = {
  error: null,
}

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
})

// A selector to get global loading state
export const selectLoading = createSelector(
  [selectWeEthBalanceLoading, selectPriceLoading],
  (balancesLoading, priceLoading) => balancesLoading || priceLoading
)

export const { setError, clearError } = statusSlice.actions
export const selectErrorMessage = (state: RootState) => state.status.error
export const statusReducer = statusSlice.reducer
