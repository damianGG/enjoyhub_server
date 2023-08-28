//import { VenueCategory } from './venueCategory.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { Photo } from './photo.entity';

@Entity()
export class Venue {
  @PrimaryColumn({ type: 'char', length: 36 })
  @Generated('uuid')
  id: string;

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

  @ManyToOne(() => User, (user) => user.venues)
  user: User;

  @ManyToOne(() => Category, (category) => category.venue)
  category: Category;

  @OneToMany(() => Photo, (photo) => photo.venue)
  photos: Photo[];
}
