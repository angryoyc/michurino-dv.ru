module.exports = process.env.APP_COV
  ? require('./app-cov/main') 
  : require('./app/main')