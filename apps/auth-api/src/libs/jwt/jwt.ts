export class Jwt<TPayload = Record<string, unknown>> {
  constructor(private readonly token: string) {}

  toString(): string {
    return this.token;
  }

  payload(): TPayload {
    const payloadPart = this.token.split('.')[1];
    if (!payloadPart) {
      throw new Error('Invalid JWT token: No payload found');
    }
    const payload = Buffer.from(payloadPart, 'base64').toString('utf-8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(payload);
  }
}
