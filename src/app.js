import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import chalk from 'chalk';
import cors from 'cors';
import fs from 'fs';
import swaggerUI from 'swagger-ui-express';
import docs from './docs';

// Require dependencies
require('dotenv').config();
require('./database')

// Use express's app 
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use('/api-docs', swaggerUI.serve , swaggerUI.setup(docs));

// Allow CROS origin
app.all('*', (req, res, next) => {
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Credentials', true);
	res.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE, PUT');
	res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
	
	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	} else {
		next();
	}
});

// First route
app.get('/', (req, res) => {
  	res.send({
		success: true,
		status: 200
	});
});

// Load all model file
const routesPath = `${__dirname}/routes`;
fs.readdirSync(routesPath).forEach((file) => {
	const R = require(`${routesPath}/${file}`);
	app.use('/api', R);
});

// Listen server (Start)
app.listen(process.env.PORT, () => {
  // Log server up
  	console.log(chalk.bold.yellow("Server started at " + new Date() + " on port " + process.env.PORT));
});

