const config = {
  baseurl: 'https://aniwatch.co.at',
  baseurl2: 'https://aniwatch.co.at',
  origin: '*',
  port: 5000,

  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
  },

  logLevel: 'INFO',
  enableLogging: false,
  isProduction: true,
  isDevelopment: false,
  isVercel: true,
};

export default config;
