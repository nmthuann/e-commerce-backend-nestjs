import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { PipeError } from '../constants/errors.enum'
import { CreateEmployeeDto } from '../modules/auth/dto/create-employee.dto'

@Injectable()
export class CreateEmployeePipeValidator implements PipeTransform {
  transform(value: CreateEmployeeDto) {
    const requiredFields = [
      'first_name',
      'last_name',
      // 'avatar_url',
      'gender',
      'birthday',
      'address',
      'phone',
      'employee_id',
      'position_id'
    ]

    const missingFields = requiredFields.filter(field => !value[field])

    if (missingFields.length > 0) {
      console.log(value)
      throw new BadRequestException(`${missingFields.join(', ')} ${PipeError.VALIDATOR_MISSING}`)
    }

    return value
  }
}

// if (Object.values(value).some(field => !field && requiredFields.includes(field))) {
//   throw new BadRequestException(`${requiredFields} ${PipeError.VALIDATOR_MISSING}`);
// }

// return value;
