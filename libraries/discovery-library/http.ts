import { DISCOVERY_SERVICE } from './constants';
import { request } from './request';

function buildUrl(service: string, path: string) {
  return ['http://localhost:9000/discovery/', service === DISCOVERY_SERVICE ? '' : service, path]
    .filter(Boolean)
    .join('');
}

export function get({ service, path }: { service: string; path: string }) {
  return request({
    url: buildUrl(service, path),
    method: 'GET',
  });
}

export function post({ service, path, payload }: { service: string; path: string; payload: unknown }) {
  return request({
    url: buildUrl(service, path),
    method: 'POST',
    payload,
  });
}

export default { get, post };
