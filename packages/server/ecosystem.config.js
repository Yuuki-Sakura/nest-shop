module.exports = {
  apps: [
    {
      name: 'Nest Shop',
      script: 'dist/main.js',
      cwd: './',
      watch: '.',
      ignore_watch: [
        // 不用监听的文件
        'node_modules',
        'logs',
      ],
      exec_mode: 'cluster_mode',
      instances: 'max',
      merge_logs: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  // deploy: {
  //   production: {
  //     user: 'SSH_USERNAME',
  //     host: 'SSH_HOSTMACHINE',
  //     ref: 'origin/master',
  //     repo: 'GIT_REPOSITORY',
  //     path: 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy':
  //       'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': '',
  //   },
  // },
};
