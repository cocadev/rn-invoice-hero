import {createAsyncThunk} from '@reduxjs/toolkit';
import {api, ApiRequestEnum} from '../../utils/api';
import {Business} from '../../models/business';

export const getUserBusiness = createAsyncThunk(
  'business/get_user_business',
  async (): Promise<Business | null> => {
    try {
      const {data} = await api.get<Business>(ApiRequestEnum.GET_USER_BUSINESS);

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);
