import { AuthEntity } from '@joinus/domain';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Role } from '../../role';

@Entity()
export class Auth implements AuthEntity {
  @PrimaryColumn({ name: 'user_uuid' })
  uuid!: string;

  @Column({ type: 'boolean', name: 'is_phone_verified', default: false })
  isPhoneVerified!: boolean;

  @Column({ type: 'boolean', name: 'is_email_verified', default: false })
  isEmailVerified!: boolean;

  @Column({ type: 'varchar', name: 'password_hash', nullable: false })
  passwordHash?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  public clear() {
    delete this.passwordHash;

    return this;
  }
}
