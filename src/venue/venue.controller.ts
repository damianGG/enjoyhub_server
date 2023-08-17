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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
//import { UpdateVenueDto } from './dto/update-venue.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.venueService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVenueDto: UpdateVenueDto) {
  //   return this.venueService.update(id, updateVenueDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.venueService.remove(id);
  }
}
