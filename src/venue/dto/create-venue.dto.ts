import {
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateVenueDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  country: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsOptional()
  userId?: string;

  @IsOptional()
  @IsString()
  latitude?: number;

  @IsOptional()
  @IsString()
  longitude?: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
