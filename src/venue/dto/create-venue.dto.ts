import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  IsUrl,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class CreateVenueDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  status: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  country: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  city: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  street: string;

  @IsNotEmpty()
  @IsString()
  street_number: string;

  @IsOptional()
  @IsString()
  phone_number_1?: string;

  @IsOptional()
  @IsString()
  phone_number_2?: string;

  @IsOptional()
  @IsUrl()
  webiste?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl()
  facebook?: string;

  @IsOptional()
  @IsUrl()
  instagram?: string;

  @IsOptional()
  @IsUrl()
  tiktok?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  user_ratings_total?: string;

  @IsOptional()
  @IsString()
  description_1?: string;

  @IsOptional()
  @IsString()
  description_2?: string;

  @IsOptional()
  @IsString()
  description_3?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsString()
  userId?: string;
}
