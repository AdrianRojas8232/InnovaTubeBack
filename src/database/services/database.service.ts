import { createPool, Pool, PoolConnection, QueryError, RowDataPacket, FieldPacket } from 'mysql2';
import poolOptions from '../config/database.config';

const pool: Pool = createPool(poolOptions);

export class DatabaseService {
  private static connection: PoolConnection;

  public static async getConnection(): Promise<PoolConnection> {
    if (!this.connection) {
      this.connection = await new Promise<PoolConnection>((resolve, reject) => {
        pool.getConnection((err, connection) => {
          if (err) {
            reject(err);
          } else {
            resolve(connection);
          }
        });
      });
    }
    return this.connection;
  }

  public static executeQuery(sql: string, values: any[] = []): Promise<RowDataPacket[]> {
    return new Promise<RowDataPacket[]>((resolve, reject) => {
      pool.query(sql, values, (err: QueryError | null, results: RowDataPacket[], fields: FieldPacket[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}
