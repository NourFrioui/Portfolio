import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-objectid.pipe';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new project',
    description: 'Create a new portfolio project with details, technologies, and media',
  })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
  })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all projects',
    description: 'Retrieve all projects as a simple array for frontend display',
  })
  @ApiResponse({
    status: 200,
    description: 'Projects retrieved successfully',
  })
  findAll() {
    return this.projectsService.findAllSimple();
  }

  @Get('paginated')
  @ApiOperation({
    summary: 'Get paginated projects',
    description: 'Retrieve projects with pagination for admin dashboard',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated projects retrieved successfully',
  })
  findAllPaginated(@Query() query: PaginationQueryDto) {
    return this.projectsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get project by ID',
    description: 'Retrieve a specific project by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Project retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update project',
    description: 'Update an existing project with new information',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete project',
    description: 'Remove a project from the portfolio',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.projectsService.remove(id);
  }
}
