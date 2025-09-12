import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User, UserDocument } from './entities/user.entity';
import { generateRandomPassword } from 'src/common/utils';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel({
      username: createUserDto.username,
      email: createUserDto.email?.toLocaleLowerCase(),
      role: createUserDto.role,
    });

    const password = generateRandomPassword();
    console.log('password generated', password);
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
    createdUser.password = await bcrypt.hash(password, salt);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  // Portfolio profile methods
  async getProfile(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-password -token').exec();
  }

  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateProfileDto, { new: true })
      .select('-password')
      .exec();
  }

  async getPublicProfile(): Promise<UserDocument | null> {
    // Get the first admin user as the portfolio owner
    return this.userModel.findOne({ role: 'ADMIN' }).select('-password').exec();
  }
  // Calculate profile completion percentage
  async getProfileCompletion(id: string): Promise<{
    percentage: number;
    missingFields: string[];
    completedFields: string[];
  }> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new Error('User not found');
    }

    const requiredFields = [
      'fullName',
      'title',
      'bio',
      'description',
      'location',
      'phone',
      'profileImageUrl',
      'website',
      'github',
      'linkedIn',
    ];

    const arrayFields = ['skills', 'languages'];

    const completedFields: string[] = [];
    const missingFields: string[] = [];

    // Check regular fields (including localized fields)
    requiredFields.forEach((field) => {
      const value = user[field as keyof User];
      if (value) {
        // Check if it's a localized field
        if (typeof value === 'object' && value !== null && 'en' in value) {
          const localizedValue = value as { en?: string; fr?: string };
          if (localizedValue.en && localizedValue.en.toString().trim() !== '') {
            completedFields.push(field);
          } else {
            missingFields.push(field);
          }
        } else if (
          typeof value === 'string' &&
          value.toString().trim() !== ''
        ) {
          completedFields.push(field);
        } else {
          missingFields.push(field);
        }
      } else {
        missingFields.push(field);
      }
    });

    // Check array fields (including localized arrays)
    arrayFields.forEach((field) => {
      const value = user[field as keyof User];
      if (value && Array.isArray(value) && value.length > 0) {
        // Check if it's a localized array
        if (
          value[0] &&
          typeof value[0] === 'object' &&
          value[0] !== null &&
          'en' in value[0]
        ) {
          const localizedArray = value as Array<{ en?: string; fr?: string }>;
          const hasValidEntries = localizedArray.some(
            (item) => item.en && item.en.toString().trim() !== '',
          );
          if (hasValidEntries) {
            completedFields.push(field);
          } else {
            missingFields.push(field);
          }
        } else {
          completedFields.push(field);
        }
      } else {
        missingFields.push(field);
      }
    });

    const totalFields = requiredFields.length + arrayFields.length;
    const percentage = Math.round((completedFields.length / totalFields) * 100);

    return {
      percentage,
      missingFields,
      completedFields,
    };
  }

  // Validate profile data
  validateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Email validation
    if (updateProfileDto.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateProfileDto.email)) {
        errors.push('Invalid email format');
      }
    }

    // URL validations
    const urlFields = ['website', 'linkedIn', 'github', 'twitter', 'resumeUrl'];
    urlFields.forEach((field) => {
      const value = updateProfileDto[field as keyof UpdateProfileDto];
      if (value && typeof value === 'string') {
        try {
          new URL(value);
        } catch {
          errors.push(`Invalid ${field} URL format`);
        }
      }
    });

    // Phone validation
    if (updateProfileDto.phone) {
      const phoneRegex = /^[+]?[1-9]?[0-9]{7,15}$/;
      if (!phoneRegex.test(updateProfileDto.phone.replace(/[\s\-()]/g, ''))) {
        warnings.push('Phone number format may not be valid');
      }
    }

    // Bio length validation (for localized fields)
    if (updateProfileDto.bio) {
      const bio = updateProfileDto.bio as { en?: string; fr?: string } | string;
      if (typeof bio === 'object' && bio !== null && 'en' in bio) {
        if (bio.en && bio.en.length > 500) {
          errors.push('Bio must be less than 500 characters');
        }
      } else if (typeof bio === 'string') {
        if (bio.length > 500) {
          errors.push('Bio must be less than 500 characters');
        }
      }
    }

    // Years of experience validation
    if (updateProfileDto.yearsOfExperience !== undefined) {
      if (
        updateProfileDto.yearsOfExperience < 0 ||
        updateProfileDto.yearsOfExperience > 50
      ) {
        errors.push('Years of experience must be between 0 and 50');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Update profile image URL
  async updateProfileImageUrl(
    id: string,
    imageUrl: string,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, { profileImageUrl: imageUrl }, { new: true })
      .select('-password')
      .exec();
  }

  // Get profile image URL
  async getProfileImageUrl(id: string): Promise<string | null> {
    const user = await this.userModel
      .findById(id)
      .select('profileImageUrl')
      .exec();
    return user?.profileImageUrl || null;
  }
}
