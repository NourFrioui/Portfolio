import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Experience, ExperienceDocument } from './entities/experience.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectModel(Experience.name)
    private experienceModel: Model<ExperienceDocument>,
  ) {}

  async create(createExperienceDto: CreateExperienceDto): Promise<Experience> {
    const createdExperience = new this.experienceModel(createExperienceDto);
    return createdExperience.save();
  }

  async findAll(): Promise<Experience[]> {
    return this.experienceModel.find().sort({ startDate: -1 }).exec();
  }

  async findPaginated(pagination?: PaginationQueryDto): Promise<{
    data: Experience[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.experienceModel
        .find()
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.experienceModel.countDocuments().exec(),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Experience | null> {
    return this.experienceModel.findById(id).exec();
  }

  async update(
    id: string,
    updateExperienceDto: UpdateExperienceDto,
  ): Promise<Experience | null> {
    const updated = await this.experienceModel
      .findByIdAndUpdate(
        id,
        { ...updateExperienceDto, updatedAt: new Date() },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('Experience not found');
    return updated;
  }

  async remove(id: string): Promise<Experience | null> {
    const deleted = await this.experienceModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Experience not found');
    return deleted;
  }
}
