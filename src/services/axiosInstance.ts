import config from '../config/config';

export const axiosInstance = async (
  endpoint: string,
  options: { headers?: Record<string, string> } = {}
) => {
  const { headers: customHeaders = {} } = options;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const targetUrl = `${config.baseurl}${cleanEndpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8500);

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        ...config.headers,
        ...customHeaders,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.text();

    if (!data || data.length === 0) {
      throw new Error('Empty response received');
    }

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    let errorMsg = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMsg = error.name === 'AbortError' ? 'Request timeout' : error.message;
    }
    return {
      success: false,
      message: errorMsg,
    };
  }
};
