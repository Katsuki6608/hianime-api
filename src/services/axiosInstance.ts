import config from '../config/config';

export const axiosInstance = async (
  endpoint: string,
  options: { headers?: Record<string, string> } = {}
) => {
  const { headers: customHeaders = {} } = options;
  const targetUrl = `${config.baseurl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8500);

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
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
