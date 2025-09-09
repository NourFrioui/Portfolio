import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().sort({ order: 1, name: 1 }).exec();
  }

  async findActive(): Promise<Category[]> {
    return this.categoryModel
      .find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();

    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return updatedCategory;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  async findByName(name: string): Promise<Category | null> {
    return this.categoryModel.findOne({ name }).exec();
  }

  async reorder(categoryIds: string[]): Promise<CategoryDocument[]> {
    const results: CategoryDocument[] = [];

    for (let i = 0; i < categoryIds.length; i++) {
      const updated = await this.categoryModel
        .findByIdAndUpdate(categoryIds[i], { order: i + 1 }, { new: true })
        .exec();

      if (updated) {
        results.push(updated);
      }
    }

    return results;
  }
}
