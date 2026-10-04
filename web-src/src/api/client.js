// Single axios instance used by every screen (the mobile app called axios directly
// against http://192.168.29.2:5000). In "mock" mode requests are answered by the
// in-browser mock backend; in "live" mode they go to VITE_API_URL.
import axios, { AxiosError } from 'axios';
import { handle } from './mockServer';

export const API_MODE = import.meta.env.VITE_API_MODE || 'mock';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function mockAdapter(config) {
  const { status, data } = await handle(config.method, config.url, config.data);
  const response = { data, status, statusText: String(status), headers: {}, config, request: {} };
  if (status >= 200 && status < 300) return response;
  throw new AxiosError(
    `Request failed with status code ${status}`,
    status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
    config,
    response.request,
    response,
  );
}

const api =
  API_MODE === 'live'
    ? axios.create({ baseURL: API_URL })
    : axios.create({ baseURL: '', adapter: mockAdapter });

// Live mode only: the real backend's non-auth routes now require a valid bearer
// token (GovServiceAppBackend/middleWare/jwtMiddleWare.js). The mock backend has
// no such check, so this is a no-op - and harmless - in mock mode.
if (API_MODE === 'live') {
  api.interceptors.request.use((config) => {
    let token = '';
    try {
      token = JSON.parse(localStorage.getItem('authToken') || '""');
    } catch {
      /* ignore */
    }
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}

export default api;
