type PathDataType = number[][];

type PathSimplifierOptions = {
  map?: any;
  zIndex?: number;
  data?: number[][];
  getPath?: (pathData: {}, pathIndex: number) => PathDataType;
  getZIndex?: (pathData: any, pathIndex: number) => number;
  getHoverTitle?: (pathData: any, pathIndex: number, pointIndex: number) => string;
  autoSetFitView?: boolean;
  clickToSelectPath?: boolean;
  onTopWhenSelected?: boolean;
  renderConstructor?: Function;
  renderOptions?: {};
};

interface PathSimplifier {
  new (options: PathSimplifierOptions);

  readonly supportCanvas: boolean;

  getZIndexOfPath: (pathIndex: number) => number;

  setZIndexOfPath: (pathIndex: number, zIndex: number) => void;

  /**
   * 是否置顶显示pathIndex对应的轨迹
   * @param pathIndex
   * @param isTop isTop为真，设置 zIndex 为 现存最大zIndex+1; isTop为假，设置 zIndex 为 构造参数中 getZIndex 的返回值
   */
  toggleTopOfPath: (pathIndex: number, isTop: boolean) => void;

  getPathData: (pathIndex: number) => any;

  createPathNavigator: (pathIndex: number, options: {}) => PathNavigator;

  getPathNavigators: () => any[];

  clearPathNavigators: () => void;

  getSelectedPathData: () => any;

  getSelectedPathIndex: () => number;

  isSelectedPathIndex: (pathIndex: number) => boolean;

  setSelectedPathIndex: (pathIndex: number) => void;

  render: () => void;

  renderLater: (delay: number[]) => void;

  setData: (data: any[]) => void;

  setFitView: (pathIndex: number) => void;

  on: (eventName: string, handler: Function) => void;

  off: (eventName: string, handler: Function) => void;

  hide: () => void;

  show: () => void;

  isHidden: () => boolean;

  getRender: () => boolean;

  getRenderOptions: () => any;
}

interface PathNavigatorOptions {
  loop?: boolean;
  speed?: number;
  pathNavigatorStyle?: {};
  animInterval?: number;
  dirToPosInMillsecs?: number;
  range?: number[];
}

interface PathNavigator {
  new (options: PathNavigatorOptions);

  start: (pointIndex?: number) => void;

  pause: () => void;

  resume: () => void;

  stop: () => void;

  destroy: () => void;

  getCursor: () => any;

  getNaviStatus: () => string;

  getPathIndex: () => number;

  getPosition: () => [number, number];

  getSpeed: () => number;

  getMovedDistance: () => number;

  getPathStartIdx: () => number;

  getPathEndIdx: () => number;

  moveByDistance: (distance: number) => void;

  moveToPoint: (idx: number, tail: number) => void;

  isCursorAtPathEnd: () => boolean;

  isCursorAtPathStart: () => boolean;

  setSpeed: (speed: number) => void;

  setRange: (startIndex: number, endIndex: number) => void;

  on: (eventName: string, handler: Function) => void;

  off: (eventName: string, handler: Function) => void;
}
