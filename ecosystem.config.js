module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "./logs/err.log",
      max_memory_restart: "200M",
      instances: 3,
      exec_mode: "cluster",
      
    },
  ],
};
