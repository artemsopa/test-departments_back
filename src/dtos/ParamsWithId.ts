import { z } from 'zod';

export interface ParamsWithId {
  id: string;
}

export const paramWithIdSchema: z.ZodSchema<ParamsWithId> = z.object({
  id: z.string({
    required_error: `Parameter "id" is required!`,
    invalid_type_error: `Parameter "id" must be a string!`,
  }),
});

export type ParamsWithIdDto = z.infer<typeof paramWithIdSchema>;
