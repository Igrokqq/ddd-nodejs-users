import { Connection as TypeormConnection } from "typeorm";

export interface IConnection {
  getInstance(): Promise<TypeormConnection>;
}
