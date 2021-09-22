import type { BaseItem } from '@/utils/typings';

type CertificateItem = {
  instance: string;
  description: string;
  configs?: Record<string, any>;
} & BaseItem;
