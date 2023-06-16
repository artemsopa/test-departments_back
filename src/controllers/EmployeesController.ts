import { RequestHandler } from 'express';
import { Controller } from '@/controllers/Controller';
import { EmployeesService } from '@/services/EmployeesService';
import {
  GetEmployeesQueryDto,
  getEmployeesQuerySchema,
} from '@/dtos/GetEmployeesQuery';
import { EmployeeInputDto, employeeInputSchema } from '@/dtos/EmployeeInput';
import { ParamsWithIdDto, paramWithIdSchema } from '@/dtos/ParamsWithId';
import { LinkRouter } from '@/utils/LinkRouter';
import { Employee } from '@/entities/Employee';

export class EmployeesController extends Controller {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly linkRouter: LinkRouter,
  ) {
    super('/employees');

    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get('/', this.linkRouter.link({ route: this.getAll }));
    this.router.get('/:id', this.linkRouter.link({ route: this.getById }));
    this.router.post(
      '/',
      this.linkRouter.link({ route: this.create, isAuth: true }),
    );
    this.router.put(
      '/:id',
      this.linkRouter.link({ route: this.updateById, isAuth: true }),
    );
    this.router.delete(
      '/:id',
      this.linkRouter.link({ route: this.deleteById, isAuth: true }),
    );
  };

  private getAll: RequestHandler = async (req, res) => {
    const { onContract, department, subDepartment }: GetEmployeesQueryDto =
      getEmployeesQuerySchema.parse(req.query);

    const data: Employee[] = await this.employeesService.getAll(
      onContract ? onContract === 'true' : undefined,
      department,
      subDepartment,
    );

    return res.status(200).json(data);
  };

  private getById: RequestHandler = async (req, res) => {
    const { id }: ParamsWithIdDto = paramWithIdSchema.parse(req.params);

    const data: Employee = await this.employeesService.getById(id);

    return res.status(200).json(data);
  };

  private create: RequestHandler = async (req, res) => {
    const input: EmployeeInputDto = employeeInputSchema.parse(req.body);

    const id: string = await this.employeesService.create(input);

    return res
      .status(200)
      .json({ message: `Employee with id "${id}" successfully created!` });
  };

  private updateById: RequestHandler = async (req, res) => {
    const { id }: ParamsWithIdDto = paramWithIdSchema.parse(req.params);

    const input: EmployeeInputDto = employeeInputSchema.parse(req.body);

    await this.employeesService.updateById(id, input);

    return res
      .status(200)
      .json({ message: `Employee with id "${id}" successfully updated!` });
  };

  private deleteById: RequestHandler = async (req, res) => {
    const { id }: ParamsWithIdDto = paramWithIdSchema.parse(req.params);

    await this.employeesService.deleteById(id);

    return res
      .status(200)
      .json({ message: `Employee with id "${id}" successfully deleted!` });
  };
}
