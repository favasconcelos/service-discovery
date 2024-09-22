import http from '@workspace/discovery-library/http';

import { USER_SERVICE } from './constants';

export function getUsers() {
  return http.get({
    service: USER_SERVICE,
    path: '/user',
  });
}

export function getUser({ userId }: { userId: string }) {
  return http.get({
    service: USER_SERVICE,
    path: `/user/${userId}`,
  });
}
