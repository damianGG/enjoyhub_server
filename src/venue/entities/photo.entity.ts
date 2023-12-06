import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Venue } from './venue.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column() // Dodaj to
  venueId: number;

  @ManyToOne(() => Venue, (venue) => venue.photos)
  @JoinColumn({ name: 'venueId' })
  venue: Venue;
}
