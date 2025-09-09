import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { jwtConstants } from 'src/common/constants/auth.constant';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1yr' },
    }),
  ],
  providers: [AuthService, UsersService, AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
