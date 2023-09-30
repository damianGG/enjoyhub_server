import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import { Photo } from 'src/venue/entities/photo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
//import { Venue } from 'src/venue/entities/venue.entity';

@Injectable()
export class CloudinaryService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>, // @InjectRepository(Venue)
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
      'base64',
    )}`;
    const result = await cloudinary.uploader.upload(base64Image);

    const photo = new Photo();
    photo.url = result.secure_url;

    await this.photoRepository.save(photo);

    return result;
  }
}
