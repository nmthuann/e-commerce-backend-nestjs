import { Role } from "../enums/role.enum";

export type Payload = {
  email: string;
  role: Role;
};