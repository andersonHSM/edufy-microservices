import { JwtModule } from '@nestjs/jwt';
import jwtConfig, { type JwtConfig } from 'src/libs/configuration/jwt.config';

export const ConfiguredJwtModule = JwtModule.registerAsync({
  // @ts-expect-error expiresIn is in the correct format but it still complains
  useFactory: (config: JwtConfig) => ({
    global: true,
    secret: config.secret,
    signOptions: { expiresIn: config.expiration },
  }),
  inject: [jwtConfig.KEY],
});
