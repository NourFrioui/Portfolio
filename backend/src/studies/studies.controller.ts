import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { StudiesService } from './studies.service';
import { CreateStudyDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-objectid.pipe';

@ApiTags('studies')
@ApiBearerAuth()
@Controller('studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  @Post()
  create(@Body() createStudyDto: CreateStudyDto) {
    return this.studiesService.create(createStudyDto);
  }

  @Get()
  findAll() {
    return this.studiesService.findAll();
  }

  @Get('paginated')
  findPaginated(@Query() query: PaginationQueryDto) {
    return this.studiesService.findPaginated(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.studiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateStudyDto: UpdateStudyDto,
  ) {
    return this.studiesService.update(id, updateStudyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.studiesService.remove(id);
  }
}
