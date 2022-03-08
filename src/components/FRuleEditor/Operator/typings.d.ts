import type { TreeNode } from '@/utils/tree';

interface OperatorItem extends TreeNode {
  id: string;
  name: string;
  key: string;
  description: string;
  code: string;
  children: OperatorItem[];
}
