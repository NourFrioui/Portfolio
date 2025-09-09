import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  async create(dto: CreateTagDto): Promise<Tag> {
    const created = new this.tagModel(dto);
    return created.save();
  }

  findAll(): Promise<Tag[]> {
    return this.tagModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagModel.findById(id).exec();
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async update(id: string, dto: UpdateTagDto): Promise<Tag> {
    const tag = await this.tagModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async remove(id: string): Promise<void> {
    const res = await this.tagModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Tag not found');
  }
}
