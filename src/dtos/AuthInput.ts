import { z } from 'zod';

export interface AuthInput {
  username: string;
  password: string;
}

export const authInputSchema: z.ZodSchema<AuthInput> = z.object({
  username: z.string({
    required_error: `Parameter "id" is required!`,
    invalid_type_error: `Parameter "id" must be a string!`,
  }),
  password: z.string({
    required_error: `Parameter "id" is required!`,
    invalid_type_error: `Parameter "id" must be a string!`,
  }),
});

export type AuthInputDto = z.infer<typeof authInputSchema>;
