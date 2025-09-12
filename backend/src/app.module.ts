import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TechnologiesModule } from './technologies/technologies.module';
import { ContactModule } from './contact/contact.module';
import { UploadModule } from './upload/upload.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ExperienceModule } from './experience/experience.module';
import { CategoryModule } from './category/category.module';
import { TagsModule } from './tags/tags.module';
import { StudiesModule } from './studies/studies.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { MigrationModule } from './migration/migration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio',
    ),
    AuthModule,
    UsersModule,
    ProjectsModule,
    TechnologiesModule,
    ContactModule,
    UploadModule,
    DashboardModule,
    ExperienceModule,
    CategoryModule,
    TagsModule,
    StudiesModule,
    ExperiencesModule,
    MigrationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
