import { z } from 'zod';

interface GetEmployeesQuery {
  onContract?: string;
  department?: string;
  subDepartment?: string;
}

export const getEmployeesQuerySchema: z.ZodSchema<GetEmployeesQuery> = z.object(
  {
    onContract: z
      .string()
      .refine((value) => value === 'true' || value === 'false', {
        message: `Parameter "onContract" must be a value of "true" or "false"!`,
      })
      .optional(),
    department: z.string().optional(),
    subDepartment: z.string().optional(),
  },
);

export type GetEmployeesQueryDto = z.infer<typeof getEmployeesQuerySchema>;
