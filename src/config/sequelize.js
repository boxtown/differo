module.exports = {
  username: process.env.DIFFERO_DB_USERNAME || 'root',
  password: process.env.DIFFERO_DB_PASSWORD,
  database: process.env.DIFFERO_DB_NAME || 'differo',
  host: process.env.DIFFERO_DB_HOST || '127.0.0.1',
};
