import { JwtService } from "@nestjs/jwt";
import { Jwt } from "./jwt";

describe("JWT", () => {
  let jwtService: JwtService;
  beforeAll(() => {
    jwtService = new JwtService({
      secret: "secret",
      signOptions: {
        expiresIn: "1h",
      },
    });
  });
  test("stringifies the JWT correctly", () => {
    const payload: { sub: string } = {
      sub: "a04b78e0-4c14-494d-866f-2587847aa70a",
    };
    const token = jwtService.sign(payload);

    const jwt = new Jwt<{
      sub: string;
    }>(token);

    expect(jwt.toString()).toBe(token);
  });
  test("returns the payload", () => {
    const payload: { sub: string } = {
      sub: "a04b78e0-4c14-494d-866f-2587847aa70a",
    };
    const token = jwtService.sign(payload);

    const jwt = new Jwt<{
      sub: string;
      iat: number;
      exp: number;
    }>(token);

    expect(jwt.payload()).toEqual({
      sub: payload.sub,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      iat: expect.any(Number),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      exp: expect.any(Number),
    });
  });
});
