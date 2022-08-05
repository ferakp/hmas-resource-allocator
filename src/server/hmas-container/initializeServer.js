import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import apiRoutes from './rest-api/v1/router/api';
import crypto from 'crypto';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

export default function initializeServer(router) {
  // JTW configuration
  const SECRET_KEY = crypto.randomBytes(64).toString('hex');
  //utils.addEnvVariable(path.join(__dirname, ".env"), "SECRET_KEY", SECRET_KEY);

  // Rate limit configuration
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
  });

  // dotenv configuration
  dotenv.config({ path: path.join(__dirname + '/.env') });

  const app = express();
  app.options('*', cors());
  app.use(cors('*'));
  app.use(limiter);
  app.use(express.json());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(compression());
  app.use('/api/v1', apiRoutes);

  // Shut down app if .env file doesn't have necessary variables
  if(!process.env.NODE_ENV || !process.env.APP_USERNAME || !process.env.APP_PASSWORD || !process.env.APP_USERNAME || !process.env.REST_API_HOST || !process.env.REST_API_HOST) {
    console.log("Failed to start HMAS Container due to missing .env variable.");
    process.exit();
  }

  return app;
}
