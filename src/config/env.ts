import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT access secret must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT refresh secret must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  COOKIE_SECURE: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // SMTP
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().transform(Number).default('587'),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  SMTP_FROM: z.string().default('noreply@todoapp.com'),

  // Frontend URL
  CLIENT_URL: z.string().default('http://localhost:3000'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;

export type Env = z.infer<typeof envSchema>;
