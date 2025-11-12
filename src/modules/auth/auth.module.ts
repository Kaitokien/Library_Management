import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/utils/constants';
import { JwtModule } from '@nestjs/jwt';
import { Users } from 'src/modules/users/entity/user.entity';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true, // We don't need to import the JwtModule anywhere alse in our application
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3h' },
    }),
    TypeOrmModule.forFeature([Users])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
