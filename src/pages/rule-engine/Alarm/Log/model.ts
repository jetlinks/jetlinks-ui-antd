import { model } from '@formily/reactive';

export const AlarmLogModel = model<{
  tab: 'product' | 'device' | 'department' | 'other';
}>({
  tab: 'product',
});
