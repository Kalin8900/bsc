import { UserEntity } from '@joinus/domain';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Auth } from '../../auth/entities/auth.entity';

@Entity()
export class User implements UserEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Column({ type: 'varchar', name: 'first_name' })
  firstName!: string;

  @Column({ type: 'varchar', name: 'last_name' })
  lastName!: string;

  @Column({ type: 'varchar', name: 'email', nullable: false, unique: true })
  email!: string;

  @Column({ type: 'varchar', name: 'phone', nullable: false, unique: true, length: 12 })
  phone!: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @OneToOne(() => Auth)
  @JoinColumn({ name: 'uuid' })
  auth?: Auth;
}
