import { plainToInstance, Transform, Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Max, Min, validateSync } from 'class-validator'

export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test'
}

export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.DEVELOPMENT

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  NESTJS_SERVER_PORT: number = 3000

  @IsUrl({ require_tld: false })
  PUBLIC_API_FRONTEND_URL: string

  @IsString()
  @IsNotEmpty()
  DB_HOST: string

  @Type(() => Number)
  @IsInt()
  DB_PORT: number = 5432

  @IsString()
  @IsNotEmpty()
  DB_USERNAME: string

  @IsString()
  DB_PASSWORD: string

  @IsString()
  @IsNotEmpty()
  DB_DATABASE: string

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  DB_LOGGING: boolean = false

  @IsString()
  @IsNotEmpty()
  JWT_SECRET_KEY: string

  @Type(() => Number)
  @IsInt()
  @Min(60)
  JWT_ACCESS_EXPIRES_IN: number = 900

  @IsString()
  @IsNotEmpty()
  REFRESH_JWT_SECRET_KEY: string

  @Type(() => Number)
  @IsInt()
  @Min(60)
  JWT_REFRESH_EXPIRES_IN: number = 604800

  // Stripe chỉ bắt buộc khi làm luồng thanh toán (P5.4)
  @IsOptional()
  @IsString()
  STRIPE_API_KEY?: string

  @IsOptional()
  @IsString()
  STRIPE_WEBHOOK_SECRET?: string
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const env = plainToInstance(EnvironmentVariables, config, { exposeDefaultValues: true })
  const errors = validateSync(env, { skipMissingProperties: false })

  if (errors.length > 0) {
    const details = errors.map(e => `  - ${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`).join('\n')
    throw new Error(`Biến môi trường không hợp lệ:\n${details}`)
  }
  return env
}
