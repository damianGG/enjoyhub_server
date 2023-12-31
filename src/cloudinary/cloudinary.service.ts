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

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
      'base64',
    )}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
    });

    const photo = new Photo();
    photo.url = result.secure_url;
    photo.venueId = parseInt(folder);

    await this.photoRepository.save(photo);

    return result;
  }

  async getImagesFromFolder(folder: string) {
    console.log(`Fetching images from folder: ${folder}`);
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by('public_id', 'desc')
      .max_results(30)
      .execute();
    return result.resources; // Zwraca listę zdjęć
  }

  async deleteImage(publicId: string): Promise<any> {
    try {
      // Usuwanie obrazu z Cloudinary
      const cloudinaryResult = await cloudinary.uploader.destroy(publicId);

      // Usuwanie obrazu z bazy danych
      const deleteResult = await this.photoRepository
        .createQueryBuilder()
        .delete()
        .from(Photo)
        .where('url LIKE :publicId', {
          publicId: `%${publicId}%`,
        })
        .execute();

      console.log(cloudinaryResult);
      console.log(deleteResult);
      // Zwracanie wyników operacji
      return {
        cloudinary: cloudinaryResult,
        database: deleteResult,
      };
    } catch (error) {
      throw new Error('Error deleting image: ' + error.message);
    }
  }
}
