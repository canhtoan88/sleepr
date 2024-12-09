import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';
import { validateSync } from 'class-validator';

export function configValidation<T>(
  cls: ClassConstructor<T>,
  config: Record<string, unknown>,
  options?: ClassTransformOptions,
) {
  const validatedConfig = plainToInstance(cls, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig as object, {
    skipMissingProperties: false,
    ...options,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
