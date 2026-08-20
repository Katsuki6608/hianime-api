import config from '../config/config';

export const axiosInstance = async (
  endpoint: string,
  options: { headers?: Record<string, string> } = {}
) => {
  const { headers: customHeaders = {} } = options;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const targetUrl = `https://hianime.to${cleanEndpoint}`;

  // Dedicated worker proxy that bypasses Cloudflare datacenter IP blocks
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9500);

  try {
    const response = await fetch(proxyUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
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
