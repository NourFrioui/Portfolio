import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const createdTag = new this.tagModel(createTagDto);
    return createdTag.save();
  }

  async findAll(): Promise<Tag[]> {
    return this.tagModel
      .find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .exec();
  }

  async findPaginated(paginationQuery: PaginationQueryDto): Promise<{
    data: Tag[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = paginationQuery.page ?? 1;
    const limit = paginationQuery.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.tagModel
        .find({ isActive: true })
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.tagModel.countDocuments({ isActive: true }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagModel.findById(id).exec();
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async findByCategory(category: string): Promise<Tag[]> {
    return this.tagModel
      .find({ category, isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .exec();
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const updatedTag = await this.tagModel
      .findByIdAndUpdate(id, updateTagDto, { new: true })
      .exec();
    if (!updatedTag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return updatedTag;
  }

  async remove(id: string): Promise<void> {
    const result = await this.tagModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
  }

  async incrementUsageCount(tagIds: string[]): Promise<void> {
    await this.tagModel.updateMany(
      { _id: { $in: tagIds } },
      { $inc: { usageCount: 1 } },
    );
  }

  async decrementUsageCount(tagIds: string[]): Promise<void> {
    await this.tagModel.updateMany(
      { _id: { $in: tagIds } },
      { $inc: { usageCount: -1 } },
    );
  }

  async searchTags(query: string): Promise<Tag[]> {
    return this.tagModel
      .find({
        $or: [
          { 'name.en': { $regex: query, $options: 'i' } },
          { 'name.fr': { $regex: query, $options: 'i' } },
        ],
        isActive: true,
      })
      .sort({ usageCount: -1, order: 1 })
      .limit(10)
      .exec();
  }
}
