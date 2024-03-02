import { PoolOptions } from 'mysql2';
import * as dotenv from 'dotenv';

dotenv.config();

const poolOptions: PoolOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

export default poolOptions;
