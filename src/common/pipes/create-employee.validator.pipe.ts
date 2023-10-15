import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CreateEmployeeDto } from 'src/modules/authentication/auth-dto/create-employee.dto';
import { PipeError } from '../errors/errors';


@Injectable()
export class CreateEmployeePipeValidator implements PipeTransform {
  transform(value: CreateEmployeeDto) {
    const requiredFields = [
      'first_name',
      'last_name',
      'avatar_url',
      'gender',
      'birthday',
      'address',
      'phone',
      'employee_id',
      'position_id',
    ];

    if (Object.values(value).some(field => !field && requiredFields.includes(field))) {
      throw new BadRequestException(`${PipeError.VALIDATOR_MISSING}`);
    }

    return value;
  }
}