import { MigrationInterface, QueryRunner } from 'typeorm';

interface Employee {
  name: string;
  salary: number;
  currency: string;
  department: string;
  sub_department: string;
  on_contract?: boolean;
}

export class InsertJsonData1686870039476 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const jsonData = `
            [
                {
                  "name": "Abhishek",
                  "salary": "145000",
                  "currency": "USD",
                  "department": "Engineering",
                  "sub_department": "Platform"
                },
                {
                  "name": "Anurag",
                  "salary": "90000",
                  "currency": "USD",
                  "department": "Banking",
                  "on_contract": "true",
                  "sub_department": "Loan"
                },
                {
                  "name": "Himani",
                  "salary": "240000",
                  "currency": "USD",
                  "department": "Engineering",
                  "sub_department": "Platform"
                },
                {
                  "name": "Yatendra",
                  "salary": "30",
                  "currency": "USD",
                  "department": "Operations",
                  "sub_department": "CustomerOnboarding"
                },
                {
                  "name": "Ragini",
                  "salary": "30",
                  "currency": "USD",
                  "department": "Engineering",
                  "sub_department": "Platform"
                },
                {
                  "name": "Nikhil",
                  "salary": "110000",
                  "currency": "USD",
                  "on_contract": "true",
                  "department": "Engineering",
                  "sub_department": "Platform"
                },
                {
                  "name": "Guljit",
                  "salary": "30",
                  "currency": "USD",
                  "department": "Administration",
                  "sub_department": "Agriculture"
                },
                {
                  "name": "Himanshu",
                  "salary": "70000",
                  "currency": "EUR",
                  "department": "Operations",
                  "sub_department": "CustomerOnboarding"
                },
                {
                  "name": "Anupam",
                  "salary": "200000000",
                  "currency": "INR",
                  "department": "Engineering",
                  "sub_department": "Platform"
                }
              ]`;

    const data: Employee[] = JSON.parse(jsonData);

    await queryRunner.query(`
              INSERT INTO employees (name, salary, currency, department, sub_department, on_contract)
              VALUES
                ${data
                  .map(
                    ({
                      name,
                      salary,
                      currency,
                      department,
                      sub_department,
                      on_contract,
                    }) =>
                      `('${name}', '${salary}', '${currency}', '${department}', '${sub_department}', '${
                        on_contract ? on_contract : false
                      }')`,
                  )
                  .join(',')}
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM employees');
  }
}
