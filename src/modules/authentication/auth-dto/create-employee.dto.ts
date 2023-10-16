/**
 * Yêu cầu:
 *
 * 1. first name
 * 2. last Name
 * 3. gender
 * 4. dob
 * 5. địa chỉ
 * 6. phone
 * 7. avatar_url
 *
 *
 * 1. employee_id
 * // 2. salary
 * // 3. work_status
 * 4. position_id
 */

import { IsEmpty, IsString } from "class-validator";

export class CreateEmployeeDto{


    first_name: string;

    last_name: string;
    avatar_url:string;

    gender: string;

    birthday: Date;
  
    address: string;

    phone: string;

    employee_id: string;

    position_id?: string;
}