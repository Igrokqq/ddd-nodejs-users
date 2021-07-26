import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Unique,
} from "typeorm";

@Entity({
  name: "users",
})
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "varchar",
    length: 24,
  })
  first_name = "";

  @Column({
    type: "varchar",
    length: 24,
  })
  last_name = "";

  @Column({
    type: "varchar",
    unique: true,
    length: 64,
  })
  email = "";

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
