import {createSlice} from '@reduxjs/toolkit';
import {Client} from '../../models/client';
import {loadClients, searchByClientName} from '../thunk/clients';

type Type = {
  clients: {
    result: Client[];
    loading: boolean;
    error: any;
  };
  searchByClientName: {
    result: (Client & {sum: number})[];
    loading: boolean;
    error: any;
  };
  searchFilter: {
    categories: string[];
    start: string;
    end: string;
    min: string;
    max: string;
  };
};

const initialState: Type = {
  clients: {
    result: [],
    loading: false,
    error: null,
  },
  searchByClientName: {
    result: [],
    loading: false,
    error: null,
  },
  searchFilter: {
    categories: [],
    start: '',
    end: '',
    min: '',
    max: '',
  },
};

export const clientsState = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearStoreClients: state => {
      return {
        ...initialState,
      };
    },
    setFilter: (state, action) => {
      state.searchFilter = {
        ...state.searchFilter,
        ...action.payload,
      };
    },
    clearFilter: state => {
      state.searchFilter = initialState.searchFilter;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadClients.fulfilled, (state, action) => {
        state.clients = {
          ...state.clients,
          loading: false,
          result: action.payload,
        };
      })
      .addCase(searchByClientName.pending, (state, action) => {
        state.searchByClientName = {
          ...state.searchByClientName,
          loading: true,
        };
      })
      .addCase(searchByClientName.rejected, (state, action) => {
        state.searchByClientName = {
          ...state.searchByClientName,
          loading: false,
        };
      })
      .addCase(searchByClientName.fulfilled, (state, action) => {
        state.searchByClientName = {
          ...state.searchByClientName,
          loading: false,
          result: action.payload,
        };
      });
  },
});

export const {clearStoreClients, setFilter, clearFilter} = clientsState.actions;

export const clientsReducer = clientsState.reducer;
