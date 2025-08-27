import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [AuthModule, ProjectsModule, UsersModule, ContactModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
