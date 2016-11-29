module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    {
      name: "api",
      script: "src/index.js",
      env: {},
      env_production: {
        NODE_ENV: "production",
        DATABASE_URL: "postgres://mi362db.cgdbfedxvmkp.us-west-2.rds.amazonaws.com:5432/mi361"
      }
    }
  ]
}
