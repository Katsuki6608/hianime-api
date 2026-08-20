import config from '../config/config';

export const axiosInstance = async (
  endpoint: string,
  options: { headers?: Record<string, string> } = {}
) => {
  const { headers: customHeaders = {} } = options;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const targetUrl = `${config.baseurl}${cleanEndpoint}`;

  // Dedicated CORS/CF Bypass worker proxy
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9500);

  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        ...config.headers,
        ...customHeaders,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Fallback: Direct fetch
      const directRes = await fetch(targetUrl, {
        headers: config.headers,
      });
      if (!directRes.ok) {
        throw new Error(`HTTP ${directRes.status}: ${directRes.statusText}`);
      }
      const directHtml = await directRes.text();
      return { success: true, data: directHtml };
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
