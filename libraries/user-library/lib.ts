import http from "@workspace/discovery-library/http";

import { USER_SERVICE } from "./constants";

export function getUsers() {
  return http.get({
    path: "/user",
    service: USER_SERVICE,
  });
}

export function getUser({ userId }: { userId: string }) {
  return http.get({
    path: `/user/${userId}`,
    service: USER_SERVICE,
  });
}
