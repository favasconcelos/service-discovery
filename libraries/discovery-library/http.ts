import { request } from './request';

export function get({ service, path }: { service: string; path: string }) {
  return request({
    url: `http://localhost:9000/discovery/${service}${path}`,
    method: 'GET',
  });
}

export function post({ service, path, payload }: { service: string; path: string; payload: unknown }) {
  return request({
    url: `http://localhost:9000/discovery/${service}${path}`,
    method: 'POST',
    payload,
  });
}

export default { get, post };
