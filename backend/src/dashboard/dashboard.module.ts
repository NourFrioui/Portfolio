import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Project, ProjectSchema } from '../projects/entities/project.entity';
import { User, UserSchema } from '../users/entities/user.entity';
import { Contact, ContactSchema } from '../contact/entities/contact.entity';
import { Technology, TechnologySchema } from '../technologies/entities/technology.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
      { name: Contact.name, schema: ContactSchema },
      { name: Technology.name, schema: TechnologySchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
