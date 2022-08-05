import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import apiRoutes from './rest-api/v1/router/api';
import * as database from './relational-database-api/database';
import crypto from 'crypto';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import * as utils from './utils/utils';
import * as errorMessages from './rest-api/v1/messages/errors';

export default function initializeServer(router) {
  // JTW configuration
  const SECRET_KEY = crypto.randomBytes(64).toString('hex');
  //utils.addEnvVariable(path.join(__dirname, ".env"), "SECRET_KEY", SECRET_KEY);

  // dotenv configuration
  dotenv.config({ path: path.join(__dirname + '/.env') });

  // Rate limit configuration
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 250,
    standardHeaders: true,
    legacyHeaders: false,
    message: JSON.stringify({ errors: [errorMessages.TOO_MANY_REQUESTS] }),
  });

  // Remove rate limit from localhost
  const rateLimiter = (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.toString().replace('::ffff:', '');
    const whitelist = ['127.0.0.1', '::1','localhost'];
    if (whitelist.indexOf(ip) >= 0) {
      next();
      return;
    }
    limiter(req, res, next);
  };

  const app = express();
  app.options('*', cors());
  app.use(cors('*'));
  app.use(rateLimiter);
  app.use(express.json());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(compression());

  app.use('/api/v1', apiRoutes);
  database.initializeDatabase();

  return app;
}
