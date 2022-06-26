import express from "express";
import cookieParser from "cookie-parser";
import cors  from "cors";
import helmet  from "helmet";
import compression  from "compression";
import bodyParser from "body-parser";
import apiRoutes  from "./rest-api/v1/router/api";
import * as database from './relational-database-api/database';
import crypto from 'crypto';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import * as utils from "./utils/utils";

export default function initializeServer (router) {
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
  dotenv.config({path: path.join(__dirname+"/.env")});

  const app = express();
  const isProduction = process.env.NODE_ENV === "production";
  const origin = { origin: isProduction ? false : "*" };

  app.use(limiter);
  app.use(express.json());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json());
  app.use(cors(origin));
  app.use(helmet());
  app.use(compression());

  app.use("/api/v1", apiRoutes);
  database.initializeDatabase();

  return app;
};
