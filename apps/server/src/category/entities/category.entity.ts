import { CategoryEntity } from '@joinus/domain';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category implements CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'text', nullable: true, name: 'image_url' })
  imageUrl!: string | null;
}
