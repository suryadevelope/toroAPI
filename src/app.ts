import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { connect, set } from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { dbConnection } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import http from "http"
import { Server } from 'socket.io';
import IoController from './socket/controllers/io.controller';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public server: http.Server;

  constructor(routes: Routes[]) {
    this.app = express();
    
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.server = http.createServer(this.app);
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    // this.initializeSwagger();
    this.initializeErrorHandling();
    this.initializeWebsocket();
  }

  public listen() {
    this.server.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`App,server are listeninng`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    connect(dbConnection.url, dbConnection.options);
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });

    this.app.use((req, res) => {
      res.status(400).json({ message: 'Bad request' });
    });

  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
  private initializeWebsocket() {
    new IoController(
      new Server(this.server, {
        cors: {
          origin: ["http://localhost:5500","http://127.0.0.1:5500"],
          credentials: true,
        },
      }),
    );
  }
}

export default App;
