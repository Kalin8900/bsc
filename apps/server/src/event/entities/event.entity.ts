import { EventEntity } from '@joinus/domain';
import type { Point } from '@joinus/server/core';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../user';

@Entity()
export class Event implements EventEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'geometry', nullable: true, srid: 4326, spatialFeatureType: 'Point' })
  location!: Point;

  @Column({ type: 'timestamp', nullable: true, name: 'start_date' })
  startDate!: Date | null;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_uuid' })
  author!: User;
}
