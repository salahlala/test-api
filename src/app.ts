import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from '@/routes/userRoutes';
import authRoutes from '@/routes/authRoutes';
// import authRoutes from '@/routes/authRoutes';
const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    // origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(cookieParser());
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
export default app;
