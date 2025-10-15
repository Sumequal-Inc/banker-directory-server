import { PartialType } from '@nestjs/mapped-types';
import { CreateBrokerDirectoryDto } from './create-broker-directory.dto';

export class UpdateBrokerDirectoryDto extends PartialType(CreateBrokerDirectoryDto) {}
