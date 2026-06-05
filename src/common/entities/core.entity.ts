import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
