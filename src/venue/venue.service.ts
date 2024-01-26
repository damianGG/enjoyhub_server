import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVenueDto } from './dto/create-venue.dto';
//import { UpdateVenueDto } from './dto/update-venue.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venue } from './entities/venue.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreatePhotoDTO } from './dto/create-photo.dto';
import { Photo } from './entities/photo.entity';
import { Category } from './entities/category.entity';
import { UpdateVenueDto } from './dto/update-venue.dto';
@Injectable()
export class VenueService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectRepository(Category)
    private venueCategoryRepository: Repository<Category>,
  ) {}

  async create(createVenueDto: CreateVenueDto, user: User): Promise<Venue> {
    const category = await this.venueCategoryRepository.findOne({
      where: { id: createVenueDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    const venue = new Venue();
    venue.name = createVenueDto.name;
    venue.street = createVenueDto.street;
    venue.postalCode = createVenueDto.postalCode;
    venue.country = createVenueDto.country;
    venue.number = createVenueDto.number;
    venue.category = category; // ustawienie kategorii dla nowo powstalego miejsca -- paintball etc

    venue.user = user;

    await this.venueRepository.save(venue);

    return venue;
  }

  async update(id: number, updateVenueDto: UpdateVenueDto): Promise<Venue> {
    const venue = await this.findOne(id);

    // Aktualizuj właściwości miejsca
    Object.assign(venue, updateVenueDto);

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
    const queryBuilder = this.venueRepository
      .createQueryBuilder('venue')
      .innerJoinAndSelect('venue.category', 'category') // Zmieniono na innerJoinAndSelect
      .leftJoinAndSelect('venue.photos', 'photo')
      .addSelect('category.name', 'category_name') // Doprecyzowane addSelect
      .where('category.slug = :slug', { slug });

    //const sql = queryBuilder.getSql();
    //console.log(sql); // Powinno teraz działać poprawnie

    const results = await queryBuilder.getMany();
    //console.log(JSON.stringify(results, null, 2));
    return results;
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
  async getVenuesByUserID(userId: string) {
    return await this.venueRepository
      .createQueryBuilder('venue')
      .leftJoinAndSelect('venue.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }
  async getVenuesByUserEmail(email: string) {
    return await this.venueRepository
      .createQueryBuilder('venue')
      .leftJoinAndSelect('venue.user', 'user')
      .where('user.email = :email', { email })
      .getMany();
  }
}
