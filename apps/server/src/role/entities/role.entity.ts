import { RoleEntity } from '@joinus/domain';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role implements RoleEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  name!: string;
}
