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

  @Column({ default: 'Open' })
  status: string;

  @Column({ default: 'Default Venue Name' })
  name: string;

  @Column({ default: 'Poland', type: 'varchar', length: 255 })
  country: string;

  @Column({ default: '0000', type: 'varchar' })
  postalCode: string;

  @Column({ default: 'Default Venue Name', type: 'varchar', length: 255 })
  city: string;

  @Column({ default: 'Default Venue Name', type: 'varchar', length: 255 })
  street: string;

  @Column({ default: '1', type: 'varchar' })
  street_number: string;

  @Column({ default: '', type: 'varchar' })
  phone_number_1: string;

  @Column({ default: '', type: 'varchar' })
  phone_number_2: string;

  @Column({ default: '', type: 'varchar' })
  webiste: string;

  @Column({ default: '', type: 'varchar' })
  email: string;

  @Column({ default: '', type: 'varchar' })
  facebook: string;

  @Column({ default: '', type: 'varchar' })
  instagram: string;

  @Column({ default: '', type: 'varchar' })
  tiktok: string;

  @Column({ default: '5', type: 'varchar' })
  rating: string;

  @Column({ default: '', type: 'varchar' })
  user_ratings_total: string;

  @Column({ default: '', type: 'text' })
  description_1: string;

  @Column({ default: '', type: 'text' })
  description_2: string;

  @Column({ default: '', type: 'text' })
  description_3: string;

  @Column({ default: '', type: 'double precision' })
  latitude?: number;

  @Column({ default: '', type: 'double precision' })
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
