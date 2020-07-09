import { SimpleType } from '@/utils/common';

export class GroupData extends SimpleType {

  id: string;

  name: string;

  deviceId: any[];

  devices: any[];

  description: string;
}
