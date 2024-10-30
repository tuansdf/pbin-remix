module.exports = {
  apps: [
    {
      name: "pbin",
      script: "npm",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 42928,
      },
    },
  ],
};
