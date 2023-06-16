import { z } from 'zod';

export interface EmployeeInput {
  name: string;
  salary: number;
  currency: string;
  department: string;
  subDepartment: string;
  onContract: boolean;
}

export const employeeInputSchema: z.ZodSchema<EmployeeInput> = z.object({
  name: z.string({
    required_error: `Parameter "name" is required!`,
    invalid_type_error: `Parameter "name" must be a string!`,
  }),
  salary: z.number({
    required_error: `Parameter "salary" is required!`,
    invalid_type_error: `Parameter "salary" must be a number!`,
  }),
  currency: z.string({
    required_error: `Parameter "currency" is required!`,
    invalid_type_error: `Parameter "currency" must be a string!`,
  }),
  department: z.string({
    required_error: `Parameter "department" is required!`,
    invalid_type_error: `Parameter "department" must be a string!`,
  }),
  subDepartment: z.string({
    required_error: `Parameter "subDepartment" is required!`,
    invalid_type_error: `Parameter "subDepartment" must be a string!`,
  }),
  onContract: z.boolean({
    required_error: `Parameter "onContract" is required!`,
    invalid_type_error: `Parameter "onContract" must be a boolean!`,
  }),
});

export type EmployeeInputDto = z.infer<typeof employeeInputSchema>;
