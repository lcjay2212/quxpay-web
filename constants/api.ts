import axios from 'axios';
import { STAGING_URL } from './url';

export const post = async <T>(url: string, variable: void): Promise<T> =>
  await axios.post(`${STAGING_URL}/${url}`, variable);
