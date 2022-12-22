import {createAsyncThunk} from '@reduxjs/toolkit';
import {api, ApiRequestEnum} from '../../utils/api';
import {Pagination} from '../../models/common';
import {Client, ClientSearchByNameRequest} from '../../models/client';
import {Category} from '../../models/category';

export const loadClients = createAsyncThunk(
  'clients/load_clients',
  async (): Promise<Client[]> => {
    try {
      const {data} = await api.post<Pagination<Client>>(
        ApiRequestEnum.LOAD_CLIENTS,
        {
          status: 'Active',
        },
        {
          params: {
            limit: 1000,
            page: 1,
          },
        },
      );

      return data.items;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);

export const searchByClientName = createAsyncThunk(
  'categories/client_name',
  async (
    request: ClientSearchByNameRequest,
  ): Promise<(Client & {sum: number})[]> => {
    try {
      const {data} = await api.post<(Client & {sum: number})[]>(
        ApiRequestEnum.SEARCH_CLIENT_NAME,
        request,
      );

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);
