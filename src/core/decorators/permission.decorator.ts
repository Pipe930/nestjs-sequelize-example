import { Roles } from '@core/enums/role.enum';
import { SetMetadata } from '@nestjs/common';

export const PERMISION_KEY = "permission";
export const Permission = (role: Array<Roles>) => SetMetadata(PERMISION_KEY, role);
