import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudiesService } from './studies.service';
import { StudiesController } from './studies.controller';
import { Study, StudySchema } from './entities/study.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Study.name, schema: StudySchema }]),
  ],
  controllers: [StudiesController],
  providers: [StudiesService],
  exports: [StudiesService],
})
export class StudiesModule {}
