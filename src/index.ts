import 'module-alias/register';
import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;
interface IOptions extends mongoose.ConnectOptions {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
}
const optionsConnect: IOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: false,
};
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI as string, optionsConnect).then(() => {
  console.log('DB connection successful!');
});

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
process.on('unhandledRejection', (err: Error) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
