import config from '../config/config';

export const axiosInstance = async (
  endpoint: string,
  options: { headers?: Record<string, string> } = {}
) => {
  const { headers: customHeaders = {} } = options;
  const targetUrl = `https://hianime.to/${endpoint.replace(/^\//, '')}`;
  
  // High-speed open proxy bridge to bypass Cloudflare
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8500);

  try {
    const response = await fetch(proxyUrl, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = (await response.json()) as { contents?: string };

    if (!json.contents || json.contents.length === 0) {
      throw new Error('Empty response received from source');
    }

    return {
      success: true,
      data: json.contents,
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
