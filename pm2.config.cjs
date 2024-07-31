module.exports = {
  apps: [
    {
      name: 'notary-frontend-react',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: './build',
        PM2_SERVE_PORT: 8080, // you can choose any port
        PM2_SERVE_SPA: 'true', // if it's a Single Page Application
        PM2_SERVE_HOMEPAGE: '/index.html', // default entry point
      },
    },
  ],
};
