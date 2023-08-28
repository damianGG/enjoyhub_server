import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Venue } from './venue.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @OneToMany(() => Venue, (venue) => venue.category)
  venue: Venue[];
}
