import 'dotenv/config';

import express, { json } from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

class App {
	constructor() {
		this.server = express();

		Sentry.init(sentryConfig);

		this.middlewares();
		this.routes();
		this.exceptionHandler();
	}

	middlewares() {
		this.server.use(Sentry.Handlers.requestHandler());
		this.server.use(json());
		this.server.use(
			'/arquivos/',
			express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
		);
	}

	routes() {
		this.server.use(routes);
		this.server.use(Sentry.Handlers.errorHandler());
	}

	exceptionHandler() {
		this.server.use(async (err, req, res, next) => {
			if (process.env.NODE_ENV === 'development') {
				const erros = await new Youch(err, req).toJSON();

				return res.status(500).json(erros);
			}
			return res.status(500).json({ erro: 'Erro interno de servidor.' });
		});
	}
}

export default new App().server;
