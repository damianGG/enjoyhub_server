//import { VenueCategory } from './venueCategory.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Photo } from './photo.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Venue {
  // @PrimaryColumn({ type: 'char', length: 36 })
  // @Generated('uuid')
  // id: string;

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: 'Default Venue Name' })
  name: string;

  @Column({ default: 'Default Venue Name', type: 'varchar', length: 255 })
  city: string;

  @Column({ default: 'Default Venue Name', type: 'varchar', length: 255 })
  country: string;

  @Column({ default: 'Default Venue Name', type: 'varchar', length: 255 })
  street: string;

  @Column({ default: '1', type: 'varchar' })
  number: string;

  @Column({ default: '12345', type: 'varchar' })
  postalCode: string;

  @Column({ default: '48.1079', type: 'double precision' })
  latitude?: number;

  @Column({ default: '24.0385', type: 'double precision' })
  longitude?: number;

  @ManyToOne(() => User, (user) => user.venues)
  user: User;

  @ManyToOne(() => Category, (category) => category.venue)
  category: Category;

  @Expose()
  get categoryName(): string {
    return this.category.name;
  }

  @OneToMany(() => Photo, (photo) => photo.venue)
  photos: Photo[];
}
