import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './src/routes';
import { errorMiddleware } from './src/middlewares/errorMiddleware';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', router);
app.use('/uploads', express.static('uploads'));
app.use(errorMiddleware);

const start = () => {
  try {
    app.listen(PORT, () => console.log(`use port - ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
