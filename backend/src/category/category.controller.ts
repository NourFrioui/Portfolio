import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Creates a new category for technologies and experiences',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: Category,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieve all categories ordered by display order',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [Category],
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get active categories',
    description: 'Retrieve only active categories ordered by display order',
  })
  @ApiResponse({
    status: 200,
    description: 'Active categories retrieved successfully',
    type: [Category],
  })
  findActive() {
    return this.categoryService.findActive();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Retrieve a specific category by its ID',
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: Category,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update category',
    description: 'Update a category by its ID',
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: Category,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete category',
    description: 'Delete a category by its ID',
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  @Put('reorder')
  @ApiOperation({
    summary: 'Reorder categories',
    description: 'Update the display order of categories',
  })
  @ApiBody({
    description: 'Array of category IDs in desired order',
    schema: {
      type: 'object',
      properties: {
        categoryIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['id1', 'id2', 'id3'],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Categories reordered successfully',
    type: [Category],
  })
  reorder(@Body('categoryIds') categoryIds: string[]) {
    return this.categoryService.reorder(categoryIds);
  }
}
