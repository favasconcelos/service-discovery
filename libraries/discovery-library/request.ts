async function parseResponse(response: Response) {
  if (response.headers.get('content-type')?.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export async function request({ url, method, payload }: { url: string; method: string; payload?: unknown }) {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(5000),
  };
  if (payload) {
    options.body = JSON.stringify(payload);
  }
  const response = await fetch(url, options);
  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(data);
  }
  return data;
}
