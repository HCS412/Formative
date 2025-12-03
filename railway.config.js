// Railway deployment configuration for Formative Platform

module.exports = {
  // Railway will automatically detect this as a Node.js project
  buildCommand: 'npm install',
  startCommand: 'npm start',
  
  // Environment variables for Railway
  env: {
    NODE_ENV: 'production',
    PORT: process.env.PORT || 3000
  },
  
  // Health check configuration
  healthCheck: {
    path: '/',
    timeout: 10000
  }
};


