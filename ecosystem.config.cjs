module.exports = {
  apps: [
    {
      name: 'tovapulse-admin',
      cwd: __dirname,
      script: '.next/standalone/server.js',
      interpreter: 'node',
      instances: 1,
      autorestart: true,
      max_memory_restart: '512M',
      kill_timeout: 10000,
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1',
        NEXT_PUBLIC_API_URL: '/api/backend',
        NEXT_PUBLIC_API_BASE_URL: 'https://api.tovapulse.com',
        BACKEND_API_BASE_URL: 'http://127.0.0.1:4000',
        NEXT_PUBLIC_APP_NAME: 'TovaPulse',
      },
    },
  ],
};
