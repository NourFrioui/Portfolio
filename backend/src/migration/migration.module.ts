import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MigrationController } from './migration.controller';
import { MigrationService } from '../common/services/migration.service';
import { LocalizationService } from '../common/services/localization.service';
import { Project, ProjectSchema } from '../projects/entities/project.entity';
import {
  Technology,
  TechnologySchema,
} from '../technologies/entities/technology.entity';
import { Contact, ContactSchema } from '../contact/entities/contact.entity';
import { User, UserSchema } from '../users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Technology.name, schema: TechnologySchema },
      { name: Contact.name, schema: ContactSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MigrationController],
  providers: [MigrationService, LocalizationService],
  exports: [MigrationService, LocalizationService],
})
export class MigrationModule {}
