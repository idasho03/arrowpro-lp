module.exports = {
  apps: [
    {
      name: 'lp-client-dev',
      script: 'node_modules/.bin/parcel',
      args: 'serve lp-client/index.html --port 1234 --host localhost',
      cwd: './',
      watch: false,
      autorestart: true,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development'
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};

