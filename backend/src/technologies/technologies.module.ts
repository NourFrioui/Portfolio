import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Technology, TechnologySchema } from './entities/technology.entity';
import { TechnologiesController } from './technologies.controller';
import { TechnologiesService } from './technologies.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Technology.name, schema: TechnologySchema },
    ]),
  ],
  controllers: [TechnologiesController],
  providers: [TechnologiesService],
})
export class TechnologiesModule {}
