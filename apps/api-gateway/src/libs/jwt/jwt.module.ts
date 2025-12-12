import { JwtModule } from "@nestjs/jwt";
import jwtConfig, { JwtConfig } from "src/libs/configuration/jwt.config";

export const ConfiguredJwtModule = JwtModule.registerAsync({
  // @ts-expect-error don't leave empty
  useFactory: (config: JwtConfig) => ({
    global: true,
    secret: config.secret,
    signOptions: { expiresIn: config.expiration },
  }),
  inject: [jwtConfig.KEY],
});
