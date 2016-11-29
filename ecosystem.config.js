module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: "API",
      script: "src/index.js",
      env: {},
      env_production: {
        NODE_ENV: "production",
        DATABASE_URL: "postgres://mi362db.cgdbfedxvmkp.us-west-2.rds.amazonaws.com:5432/mi361"
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: "ubuntu",
      key: "mi361.pem",
      host: "54.191.216.3",
      ref: "origin/master",
      repo: "git@github.com:swarthout/tim-tom.git",
      path: "/var/www/production",
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.json --env production"
    }
  }
}
