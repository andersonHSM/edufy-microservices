import { registerAs } from '@nestjs/config';
import z from 'zod';

const uploadConfigSchema = z.object({
  maxSize: z.coerce.number().default(10485760), // 10MB
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png']),
  path: z.string().default('./uploads'),
  urlPrefix: z.string().default('/uploads'),
  aws: z.object({
    s3Bucket: z.string().optional(),
    s3Region: z.string().optional(),
    accessKeyId: z.string().optional(),
    secretAccessKey: z.string().optional(),
  }),
});

export default registerAs('upload', () =>
  uploadConfigSchema.parse({
    maxSize: process.env.UPLOAD_MAX_SIZE,
    allowedTypes: process.env.UPLOAD_ALLOWED_TYPES?.split(','),
    path: process.env.UPLOAD_PATH,
    urlPrefix: process.env.UPLOAD_URL_PREFIX,
    aws: {
      s3Bucket: process.env.AWS_S3_BUCKET,
      s3Region: process.env.AWS_S3_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }),
);

export type UploadConfig = z.infer<typeof uploadConfigSchema>;
