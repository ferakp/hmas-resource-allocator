import express from "express";
import cookieParser from "cookie-parser";
import cors  from "cors";
import helmet  from "helmet";
import compression  from "compression";
import bodyParser from "body-parser";
import apiRoutes  from "./rest-api/v1/router/api";
import crypto from 'crypto';
import * as utils from './utils/utils';
import path from 'path';
import dotenv from 'dotenv';
import {initializeDatabase} from './relational-database/database';
import * as databaseApi from './relational-database/api';

export default function initializeServer (router) {
  const app = express();
  const isProduction = process.env.NODE_ENV === "production";
  const origin = { origin: isProduction ? false : "*" };

  app.use(express.json());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json());
  app.use(cors(origin));
  app.use(helmet());
  app.use(compression());

  app.use("/api/v1", apiRoutes);

  // JTW configuration
  const SECRET_KEY = crypto.randomBytes(64).toString('hex');
  //utils.addEnvVariable(path.join(__dirname, ".env"), "SECRET_KEY", SECRET_KEY);

  // dotenv configuration
  dotenv.config({path: path.join(__dirname+"/.env")});

  // Relational database configuration
  initializeDatabase();

  return app;
};
