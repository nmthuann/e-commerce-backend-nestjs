export class GetEmployeeListDto {
  avatar_url: string;
  employee_id: string; // cam cước
  employee_name: string; // họ và tên
  birthday: string;
  gender: string;
  salary: string;
  position: string;
  create: string;
  work_status: boolean; // iss Archive = status
  address: string;
}
