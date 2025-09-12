import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-objectid.pipe';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({ status: 201, description: 'Tag created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active tags' })
  @ApiResponse({ status: 200, description: 'Tags retrieved successfully' })
  findAll() {
    return this.tagsService.findAll();
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated tags' })
  @ApiResponse({
    status: 200,
    description: 'Paginated tags retrieved successfully',
  })
  findPaginated(@Query() paginationQuery: PaginationQueryDto) {
    return this.tagsService.findPaginated(paginationQuery);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search tags by name' })
  @ApiQuery({ name: 'q', description: 'Search query', required: true })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  searchTags(@Query('q') query: string) {
    return this.tagsService.searchTags(query);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get tags by category' })
  @ApiResponse({
    status: 200,
    description: 'Tags by category retrieved successfully',
  })
  findByCategory(@Param('category') category: string) {
    return this.tagsService.findByCategory(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tag by ID' })
  @ApiResponse({ status: 200, description: 'Tag retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.tagsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tag' })
  @ApiResponse({ status: 200, description: 'Tag updated successfully' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.tagsService.remove(id);
  }
}
