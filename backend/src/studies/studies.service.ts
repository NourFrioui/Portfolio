import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Study, StudyDocument } from './entities/study.entity';
import { CreateStudyDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class StudiesService {
  constructor(
    @InjectModel(Study.name) private studyModel: Model<StudyDocument>,
  ) {}

  async create(createStudyDto: CreateStudyDto): Promise<Study> {
    const createdStudy = new this.studyModel(createStudyDto);
    return createdStudy.save();
  }

  async findAll(): Promise<Study[]> {
    return this.studyModel.find().sort({ startDate: -1 }).exec();
  }

  async findPaginated(
    pagination?: PaginationQueryDto,
  ): Promise<{ data: Study[]; total: number; page: number; limit: number }> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.studyModel
        .find()
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.studyModel.countDocuments().exec(),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Study | null> {
    return this.studyModel.findById(id).exec();
  }

  async update(
    id: string,
    updateStudyDto: UpdateStudyDto,
  ): Promise<Study | null> {
    const updated = await this.studyModel
      .findByIdAndUpdate(
        id,
        { ...updateStudyDto, updatedAt: new Date() },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('Study not found');
    return updated;
  }

  async remove(id: string): Promise<Study | null> {
    const deleted = await this.studyModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Study not found');
    return deleted;
  }
}
