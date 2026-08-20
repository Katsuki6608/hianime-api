import config from '../config/config';

const MAX_RETRIES = 1;
const TIMEOUT = 8000;

export const axiosInstance = async (
  endpoint: string,
  options: { headers?: Record<string, string>; retries?: number } = {}
) => {
  const { headers: customHeaders = {}, retries = MAX_RETRIES } = options;
  const targetUrl = `${config.baseurl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  // Free public proxy to bypass datacenter IP & Cloudflare blocks
  const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
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
      if (error instanceof Error) {
        lastError = error;
        if (error.name === 'AbortError') {
          lastError = new Error('Request timeout - the external API took too long to respond');
        }
      }
    }
  }

  return {
    success: false,
    message: lastError?.message || 'Unknown error occurred',
  };
};
