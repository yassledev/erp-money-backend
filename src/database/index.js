'use strict'
// require mongoose module
import mongoose from 'mongoose';

// require chalk module to give colors to console text
import chalk from 'chalk';
const connected = chalk.bold.cyan;
const error = chalk.bold.yellow;
const disconnected = chalk.bold.red;
const termination = chalk.bold.magenta;

var beginningConnectionString = "mongodb";
if(process.env.DB_HOST == "erpmoeny.isk8j.mongodb.net") //CANCER, a enlever si on part sur une bdd non hébergé en ligne derrière un tier
{
    beginningConnectionString += "+srv"     //ne marche pas si la bdd est dans Docker
}

// require database URL from properties file
const DB_URL = beginningConnectionString+'://'+process.env.DB_USER+':'+process.env.DB_PASS+'@' + process.env.DB_HOST +'/' + process.env.DB_NAME + '?retryWrites=true&w=majority';

// connection to mongodb 
mongoose.connect(DB_URL, { useFindAndModify: true, useNewUrlParser: true, useUnifiedTopology: true  });

// mongodb instance 
const db = mongoose.connection;
db.on('connected', () => {
    console.log(connected("Mongoose default connection is open to", DB_URL));
});

db.on('error', (err) => {
    console.log(error("Mongoose default connection has occured "+err+" error"));
    throw err
});

db.on('disconnected', () => {
    console.log(disconnected("Mongoose default connection is disconnected"));
});

process.on('SIGINT', () => {
    db.close(() => {
        console.log(termination("Mongoose default connection is disconnected due to application termination"));
        process.exit(0)
    });
});

