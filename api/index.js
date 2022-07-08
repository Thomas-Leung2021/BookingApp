import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js';
import usersRoute from './routes/users.js';
import hotelsRoute from './routes/hotels.js';
import roomsRoute from './routes/rooms.js';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

const connect = async () => {
  // eslint-disable-next-line
  try {
    // if first connection has issue, connection won't retry.
    // if connection established and disconnected, connection will retry.
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to mongoDB.');
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('mongoDB disconnected!');
});
mongoose.connection.on('connected', () => {
  console.log('mongoDB connected!');
});

// middlewares
app.use(cookieParser())
app.use(express.json())
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/hotels', hotelsRoute);
app.use('/api/rooms', roomsRoute);

// middleware that accepts error message
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500 // if no status the use 500
  const errorMessage = err.message || "Something went wrong!"
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack
  })
})

app.listen(8080, () => {
  connect();
  console.log('Connected to backend.');
});
