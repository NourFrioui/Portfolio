import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { Experience, ExperienceDocument } from './entities/experience.entity';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name)
    private readonly experienceModel: Model<ExperienceDocument>,
  ) {}

  async create(createExperienceDto: CreateExperienceDto): Promise<Experience> {
    const created = new this.experienceModel(createExperienceDto);
    return created.save();
  }

  async findAll(): Promise<Experience[]> {
    return this.experienceModel.find().sort({ startDate: -1 }).exec();
  }

  async findOne(id: string): Promise<Experience | null> {
    return this.experienceModel.findById(id).exec();
  }

  async update(
    id: string,
    updateExperienceDto: UpdateExperienceDto,
  ): Promise<Experience> {
    const updated = await this.experienceModel
      .findByIdAndUpdate(id, updateExperienceDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Experience not found');
    return updated;
  }

  async remove(id: string): Promise<Experience> {
    const deleted = await this.experienceModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Experience not found');
    return deleted;
  }
}
