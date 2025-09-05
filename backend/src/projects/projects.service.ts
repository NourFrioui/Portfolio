import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Project, ProjectDocument } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  async findAllSimple(): Promise<Project[]> {
    return this.projectModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const created = new this.projectModel(createProjectDto);
    return created.save();
  }

  async findAll(
    pagination?: PaginationQueryDto,
  ): Promise<{ data: Project[]; total: number; page: number; limit: number }> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.projectModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.projectModel.countDocuments().exec(),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Project | null> {
    return this.projectModel.findById(id).exec();
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const updated = await this.projectModel
      .findByIdAndUpdate(
        id,
        { ...updateProjectDto, updatedAt: new Date() },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('Project not found');
    return updated;
  }

  async remove(id: string): Promise<Project> {
    const deleted = await this.projectModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Project not found');
    return deleted;
  }
}
