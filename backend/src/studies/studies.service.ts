import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudyDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { Study, StudyDocument } from './entities/study.entity';

@Injectable()
export class StudiesService {
  constructor(
    @InjectModel(Study.name)
    private readonly studyModel: Model<StudyDocument>,
  ) {}

  async create(createStudyDto: CreateStudyDto): Promise<Study> {
    const created = new this.studyModel(createStudyDto);
    return created.save();
  }

  async findAll(): Promise<Study[]> {
    return this.studyModel.find().sort({ startDate: -1 }).exec();
  }

  async findOne(id: string): Promise<Study | null> {
    return this.studyModel.findById(id).exec();
  }

  async update(id: string, updateStudyDto: UpdateStudyDto): Promise<Study> {
    const updated = await this.studyModel
      .findByIdAndUpdate(id, updateStudyDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Study with ID ${id} not found`);
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.studyModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Study with ID ${id} not found`);
    }
  }
}
