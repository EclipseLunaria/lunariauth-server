import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { User } from "./User"; // Assuming User is in the same directory as AccessToken

@Entity()
export class AccessToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => User)
  user: User;
}
