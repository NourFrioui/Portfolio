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
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-objectid.pipe';

@ApiTags('experiences')
@ApiBearerAuth()
@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post()
  create(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experiencesService.create(createExperienceDto);
  }

  @Get()
  findAll() {
    return this.experiencesService.findAll();
  }

  @Get('paginated')
  findPaginated(@Query() query: PaginationQueryDto) {
    return this.experiencesService.findPaginated(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.experiencesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return this.experiencesService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.experiencesService.remove(id);
  }
}
