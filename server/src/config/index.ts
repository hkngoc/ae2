export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,

  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
  },

  mongo: {
    host: process.env.MONGO_HOST || "localhost",
    port: parseInt(process.env.MONGO_PORT, 10) || 27017,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    uri: process.env.MONGO_URI || "mongodb://localhost:27017",
    ae2: {
      database: process.env.MONGO_DATABASE,
      uri: process.env.MONGO_URI || "mongodb://localhost:27017",
    },
  },
});
