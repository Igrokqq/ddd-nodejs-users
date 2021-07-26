import { createConnection, Connection } from "typeorm";
import { IConnection } from "./interfaces";

class TypeormPostgresConnection implements IConnection {
  private _instance: Connection | null = null;

  private async _init(): Promise<Connection> {
    try {
      const connection = await createConnection();

      return connection;
    } catch (error) {
      console.error(error);
    }
  }

  async getInstance(): Promise<Connection> {
    if (!this._instance) {
      this._instance = await this._init();
    }

    return this._instance;
  }
}

export default new TypeormPostgresConnection().getInstance();
