import {
  DataSource,
  DeleteResult,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { EmployeeInput } from '@/dtos/EmployeeInput';
import { Employee } from '@/entities/Employee';
import { ApiError } from '@/utils/ApiError';

export class EmployeesService {
  private readonly employeesRepository: Repository<Employee>;

  public constructor(ds: DataSource) {
    this.employeesRepository = ds.getRepository(Employee);
  }

  public getAll = async (
    onContract?: boolean,
    department?: string,
    subDepartment?: string,
  ): Promise<Employee[]> => {
    console.log(onContract);
    const data: Employee[] = await this.employeesRepository.find({
      where: {
        onContract,
        department,
        subDepartment,
      },
    });

    return data;
  };

  public getById = async (id: string): Promise<Employee> => {
    const data: Employee | null = await this.employeesRepository.findOneBy({
      id,
    });

    if (!data) {
      throw ApiError.badRequest(`Unknown employee with id "${id}"`);
    }

    return data;
  };

  public create = async (input: EmployeeInput): Promise<string> => {
    const {
      raw: [{ id }],
    }: InsertResult = await this.employeesRepository.insert(input);

    return id;
  };

  public updateById = async (
    id: string,
    input: EmployeeInput,
  ): Promise<void> => {
    const { affected }: UpdateResult = await this.employeesRepository.update(
      { id },
      input,
    );

    if (affected === 0) {
      throw ApiError.badRequest(`Unknown employee with id "${id}"`);
    }
  };

  public deleteById = async (id: string): Promise<void> => {
    const { affected }: DeleteResult = await this.employeesRepository.delete(
      id,
    );

    if (affected === 0) {
      throw ApiError.badRequest(`Unknown employee with id "${id}"`);
    }
  };
}
