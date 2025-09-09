import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // Portfolio profile endpoints
  @Get(':id/profile')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieve detailed profile information for a specific user',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Patch(':id/profile')
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Update portfolio profile information for a specific user',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(id, updateProfileDto);
  }

  // Public endpoint to get portfolio data for frontend
  @Get('portfolio/public')
  @ApiOperation({
    summary: 'Get public portfolio profile',
    description: 'Retrieve public portfolio information (admin user profile)',
  })
  @ApiResponse({
    status: 200,
    description: 'Public profile retrieved successfully',
  })
  getPublicProfile() {
    return this.usersService.getPublicProfile();
  }

  // Profile completion percentage endpoint
  @Get(':id/profile/completion')
  @ApiOperation({
    summary: 'Get profile completion percentage',
    description:
      'Calculate and return the completion percentage of user profile',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile completion percentage calculated',
    schema: {
      type: 'object',
      properties: {
        percentage: { type: 'number', example: 75 },
        missingFields: { type: 'array', items: { type: 'string' } },
        completedFields: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  getProfileCompletion(@Param('id') id: string) {
    return this.usersService.getProfileCompletion(id);
  }

  // Profile validation endpoint
  @Post(':id/profile/validate')
  @ApiOperation({
    summary: 'Validate profile data',
    description: 'Validate profile information before saving',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile validation result',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean' },
        errors: { type: 'array', items: { type: 'string' } },
        warnings: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  validateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.validateProfile(id, updateProfileDto);
  }

  // Upload profile image endpoint
  @Post(':id/profile/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiOperation({
    summary: 'Upload profile image',
    description: 'Upload and store profile image URL in database',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Image uploaded successfully',
  })
  uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateProfileImageUrl(
      id,
      file.buffer.toString('base64'),
    );
  }

  // Get profile image endpoint
  @Get(':id/profile/image')
  @ApiOperation({
    summary: 'Get profile image',
    description: 'Retrieve profile image URL from database',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async getProfileImage(@Param('id') id: string) {
    const result = await this.usersService.getProfileImageUrl(id);
    if (!result) {
      return { message: 'No image found' };
    }
    return {
      imageUrl: result,
    };
  }
}
