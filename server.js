const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDatabase = require("./helpers/database/connectDatabase");
const routers = require('./routers');
const customErrorHandler = require('./middlewares/errors/customErrorHandler');

const cors = require('cors');
dotenv.config()

connectDatabase()

const app = express()
app.use(cors({
  origin: 'https://englisheducation-vr.com.tr',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'], 
  credentials: true,
  exposedHeaders: ['Authorization'] 
}));

app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT;

app.use("/api", routers)

app.use(customErrorHandler);


app.listen(PORT,() => {
    console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
  });
