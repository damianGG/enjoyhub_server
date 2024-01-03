import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Venue } from './entities/venue.entity';

@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createVenueDto: CreateVenueDto) {
    const user = req.user; // teraz masz dostęp do danych użytkownika
    const userId = user.id;
    return this.venueService.create(createVenueDto, userId);
  }

  @Get()
  findAll() {
    return this.venueService.findAll();
  }

  @Get('/category/:categorySlug')
  async findByCategory(
    @Param('categorySlug') categorySlug: string,
  ): Promise<Venue[]> {
    return this.venueService.findByCategorySlug(categorySlug);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.venueService.findOne(id);
  }
  @Get(':id/photos')
  getPhotosByVenue(@Param('id') id: string) {
    return this.venueService.getPhotosByVenue(id);
  }

  @Get(':id/venues')
  getVenueByUserId(@Param('id') id: string) {
    return this.venueService.getVenuesByUserID(id);
  }
  @Get(':email/venues')
  getVenueByUserEmail(@Param('email') email: string) {
    return this.venueService.getVenuesByUserEmail(email);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.venueService.remove(id);
  }
}
