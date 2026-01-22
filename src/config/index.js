const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const env = process.env.NODE_ENV || "development";

const baseConfig = {
  env,
  isDev: env === "development",
  isTest: env === "test",
  isProd: env === "production",
  port: parseInt(process.env.PORT, 10) || 3000,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: process.env.JWT_EXP || "7d",
  },
};

module.exports = baseConfig;
