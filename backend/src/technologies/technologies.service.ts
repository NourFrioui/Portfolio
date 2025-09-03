import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { Technology, TechnologyDocument } from './entities/technology.entity';

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectModel(Technology.name)
    private readonly technologyModel: Model<TechnologyDocument>,
  ) {}

  async create(createTechnologyDto: CreateTechnologyDto): Promise<Technology> {
    const created = new this.technologyModel(createTechnologyDto);
    return created.save();
  }

  async findAll(): Promise<Technology[]> {
    return this.technologyModel.find().sort({ percentage: -1 }).exec();
  }

  async findOne(id: string): Promise<Technology | null> {
    return this.technologyModel.findById(id).exec();
  }

  async update(
    id: string,
    updateTechnologyDto: UpdateTechnologyDto,
  ): Promise<Technology> {
    const updated = await this.technologyModel
      .findByIdAndUpdate(id, updateTechnologyDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Technology not found');
    return updated;
  }

  async remove(id: string): Promise<Technology> {
    const deleted = await this.technologyModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Technology not found');
    return deleted;
  }
}
