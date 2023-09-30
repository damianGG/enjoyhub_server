import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVenueDto } from './dto/create-venue.dto';
//import { UpdateVenueDto } from './dto/update-venue.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venue } from './entities/venue.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreatePhotoDTO } from './dto/create-photo.dto';
import { Photo } from './entities/photo.entity';

@Injectable()
export class VenueService {
  venueCategoryRepository: any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
  ) {}

  async create(createVenueDto: CreateVenueDto, user: User): Promise<Venue> {
    const venue = new Venue();
    venue.name = createVenueDto.name;
    venue.street = createVenueDto.street;
    venue.postalCode = createVenueDto.postalCode;
    venue.country = createVenueDto.country;
    venue.number = createVenueDto.number;
    // ... ustawianie innych pól ...

    venue.user = user;

    await this.venueRepository.save(venue);

    return venue;
  }

  async findAll(): Promise<Venue[]> {
    return await this.venueRepository.find();
  }

  async findOne(id: number): Promise<Venue> {
    const venue = await this.venueRepository.findOne({ where: { id } });
    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
    return venue;
  }

  async remove(id: number): Promise<void> {
    const venue = await this.findOne(id); // this will throw an error if the venue is not found
    await this.venueRepository.remove(venue);
  }

  async findByCategorySlug(slug: string) {
    return this.venueRepository
      .createQueryBuilder('venue')
      .innerJoin('venue.category', 'category')
      .leftJoinAndSelect('venue.photos', 'photo')
      .where('category.slug = :slug', { slug })
      .getMany();
  }

  async findByIdInSlug(slug: string): Promise<Venue> {
    const id = parseInt(slug.split('-')[0]);
    const venue = await this.venueRepository.findOne({ where: { id } });
    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
    return venue;
  }

  async addPhoto(dto: CreatePhotoDTO) {
    const photo = new Photo();
    photo.url = dto.url;

    const venue = await this.venueRepository.findOneBy({ id: dto.venueId });
    if (!venue) throw new NotFoundException('Venue not found');

    photo.venue = venue;

    return await this.photoRepository.save(photo);
  }

  async getPhotosByVenue(venueId: string) {
    return await this.photoRepository
      .createQueryBuilder('photo')
      .where('photo.venueId = :venueId', { venueId })
      .getMany();
  }
}
