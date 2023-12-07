import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venue } from './venue.entity'; // Załóżmy, że istnieje taka encja
import { CategoryFeature } from './category_features.entity'; // Załóżmy, że istnieje taka encja

@Entity('venue_features')
export class VenueFeature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venueId: number;

  @Column()
  featureId: number;

  @Column()
  featureValue: string;

  @ManyToOne(() => Venue, (venue) => venue.id)
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @ManyToOne(() => CategoryFeature, (feature) => feature.id)
  @JoinColumn({ name: 'featureId' })
  feature: CategoryFeature;
}
