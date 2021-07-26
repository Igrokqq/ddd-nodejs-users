import { Connection } from "typeorm";
import typeormConnection from "./index";

export default class TypeormBaseRepository {
  protected async getConnection(): Promise<Connection> {
    return typeormConnection;
  }
}
