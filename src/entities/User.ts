import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./Post";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
