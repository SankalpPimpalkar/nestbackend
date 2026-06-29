import { PartialType } from '@nestjs/mapped-types';
import { CreateSavingDTO } from './create-saving.dto';

export class UpdateSavingDTO extends PartialType(CreateSavingDTO) {}
