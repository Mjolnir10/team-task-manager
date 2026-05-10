module.exports = {
  apps: [
    {
      name: 'team-task-manager-backend',
      script: 'server.js',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
