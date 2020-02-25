export interface NodeItem {
  colors: string;
  config: any;
  executor: string;
  executorName: string;
  id: string;
  index: number;
  label: string;
  nodeId: string;
  shape: string;
  size: string;
  type: string;
  x: number;
  y: number;
  running?: boolean;
}

export interface NodeProps {
  config?: any;
  save: Function;
  close: Function;
}
