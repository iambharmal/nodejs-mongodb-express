import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose, { ConnectOptions } from 'mongoose';
import authRoute from './routes/auth';
import userRoute from './routes/user';

dotenv.config();

// connect to monogo DB
const mongoUrl = process.env.MONGO_URL || '';
mongoose.connect(mongoUrl, {
  useUnifiedTopology: true
} as ConnectOptions)

const app = express();
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello DoodleBlue!');
});

app.use('/api', authRoute);
app.use('/api/user', userRoute);

export default app;