import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVenueDto } from './dto/create-venue.dto';
//import { UpdateVenueDto } from './dto/update-venue.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venue } from './entities/venue.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class VenueService {
  venueCategoryRepository: any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
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

  async findOne(id: string): Promise<Venue> {
    const venue = await this.venueRepository.findOne({ where: { id } });
    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
    return venue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async update(id: string, updateVenueDto: UpdateVenueDto): Promise<Venue> {
  //   const venue = await this.venueRepository.findOne({
  //     where: { id: id },
  //     relations: {
  //       venueCategory: true,
  //     },
  //   });

  //   if (
  //     updateVenueDto.venueCategoryId &&
  //     updateVenueDto.venueCategoryId.length > 0
  //   ) {
  //     console.log(updateVenueDto.venueCategoryId);
  //     const venueCategory = await this.venueCategoryRepository.findOne(
  //       updateVenueDto.venueCategoryId,
  //     );
  //     if (
  //       !venueCategory ||
  //       venueCategory.length !== updateVenueDto.venueCategoryId.length
  //     ) {
  //       throw new NotFoundException(`Some VenueCategories not found`);
  //     }
  //     venue.venueCategory = venueCategory;
  //   }

  //   // const venue = venues[0];
  //   // const updatedVenue = Object.assign(venue, updateVenueDto);

  //   return await this.venueRepository.save(updateVenueDto);
  // }

  async remove(id: string): Promise<void> {
    const venue = await this.findOne(id); // this will throw an error if the venue is not found
    await this.venueRepository.remove(venue);
  }
}
