import {createAsyncThunk} from '@reduxjs/toolkit';
import {api, ApiRequestEnum} from '../../utils/api';
import {InvoiceOverview} from '../../dto/invoices';
import {
  BalanceOverview,
  CategoryOverview,
  ClientOverview,
  DateOverview,
  Invoice,
  InvoiceRequest,
  InvoiceStatus,
} from '../../models/invoice';
import {Pagination} from '../../models/common';
import {showMessage} from 'react-native-flash-message';
import {AxiosError} from 'axios';

export const loadInvoiceBalanceOverview = createAsyncThunk(
  'invoices/balance_overview',
  async (request: InvoiceOverview): Promise<BalanceOverview[]> => {
    try {
      const {data} = await api.post<BalanceOverview[]>(
        ApiRequestEnum.INVOICE_BALANCE_OVERVIEW,
        request,
      );

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);

export const loadInvoiceClientsOverview = createAsyncThunk(
  'invoices/client_overview',
  async (request: InvoiceOverview): Promise<ClientOverview[]> => {
    try {
      const {data} = await api.post<ClientOverview[]>(
        ApiRequestEnum.INVOICE_CLIENT_OVERVIEW,
        request,
      );

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);

export const loadInvoiceCategoriesOverview = createAsyncThunk(
  'invoices/categories_overview',
  async (request: InvoiceOverview): Promise<CategoryOverview[]> => {
    try {
      const {data} = await api.post<CategoryOverview[]>(
        ApiRequestEnum.INVOICE_CATEGORY_OVERVIEW,
        request,
      );

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);

export const loadInvoiceDateOverview = createAsyncThunk(
  'invoices/date_overview',
  async (
    request: InvoiceOverview,
  ): Promise<{
    result: DateOverview[];
    next?: boolean;
  }> => {
    try {
      const {data} = await api.post<{
        result: DateOverview[];
        next?: boolean;
      }>(ApiRequestEnum.INVOICE_DATE_OVERVIEW, request);

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);

export const loadSingleInvoice = createAsyncThunk(
  'invoices/single_invoice',
  async (request: any): Promise<Invoice> => {
    try {
      const {id} = request;

      const {data} = await api.get(ApiRequestEnum.INVOICE_SINGLE + id);

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);

export const updateInvoice = createAsyncThunk(
  'invoices/update_invoice',
  async (request: Partial<InvoiceRequest> & {id: string}): Promise<any> => {
    try {
      const {id} = request;

      const {data} = await api.put(ApiRequestEnum.INVOICE_UPDATE + id, request);

      showMessage({
        message:
          data.status === InvoiceStatus.Estimate
            ? 'Estimate updated'
            : 'Invoice updated',
        type: 'success',
      });

      return data;
    } catch (e: AxiosError | any) {
      if (e) {
        showMessage({
          message:
            e.response.data?.error ||
            e.response.data?.message ||
            'Error happens',
          type: 'danger',
        });
        console.log(e.response.data.error);
      }
    }
  },
);

export const getInvoiceCount = createAsyncThunk(
  'invoices/get_invoice_count',
  async (): Promise<number> => {
    let count = 0;
    try {
      const {data} = await api.post<{count: number}>(
        ApiRequestEnum.INVOICE_COUNT,
      );

      count = data.count;
    } catch (e) {
      console.log(e);
    }

    return count;
  },
);

export const loadListInvoice = createAsyncThunk(
  'invoices/list_invoice',
  async (
    request: InvoiceOverview,
  ): Promise<{
    result: DateOverview[];
    next: boolean;
  }> => {
    try {
      const {data} = await api.post<{
        result: DateOverview[];
        next: boolean;
      }>(ApiRequestEnum.INVOICE_DATE_OVERVIEW, request);

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);

export const loadSearchInvoice = createAsyncThunk(
  'invoices/search_invoice',
  async (request: InvoiceOverview): Promise<Pagination<Invoice>> => {
    try {
      const {data} = await api.post<Pagination<Invoice>>(
        ApiRequestEnum.INVOICE_SEARCH,
        request,
        {
          params: {
            limit: request.limit || 10,
            page: request.page || 1,
          },
        },
      );

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);

export const loadChartInvoice = createAsyncThunk(
  'invoices/chart_invoice',
  async (request: InvoiceOverview): Promise<Pagination<Invoice>> => {
    try {
      const {data} = await api.post<Pagination<Invoice>>(
        ApiRequestEnum.INVOICE_SEARCH,
        request,
        {
          params: {
            limit: request.limit || 10,
            page: request.page || 1,
          },
        },
      );

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);
