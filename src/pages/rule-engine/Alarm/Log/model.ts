import { model } from '@formily/reactive';

export const AlarmLogModel = model<{
  tab: string;
  solveVisible: boolean;
}>({
  tab: 'product',
  solveVisible: false,
});
