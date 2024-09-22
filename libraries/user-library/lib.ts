import http from '@workspace/discovery-library/http';

export function getUsers() {
  return http.get({
    service: 'user-service',
    path: '/user',
  });
}

export function getUser({ userId }: { userId: string }) {
  return http.get({
    service: 'user-service',
    path: `/user/${userId}`,
  });
}
