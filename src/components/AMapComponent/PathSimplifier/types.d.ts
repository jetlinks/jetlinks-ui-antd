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

class PathSimplifier {
  constructor(options: PathSimplifierOptions);

  readonly supportCanvas: boolean;

  getZIndexOfPath(pathIndex: number): number;

  setZIndexOfPath(pathIndex: number, zIndex: number);

  /**
   * 是否置顶显示pathIndex对应的轨迹
   * @param pathIndex
   * @param isTop isTop为真，设置 zIndex 为 现存最大zIndex+1; isTop为假，设置 zIndex 为 构造参数中 getZIndex 的返回值
   */
  toggleTopOfPath(pathIndex: number, isTop: boolean);

  getPathData(pathIndex: number): any;

  createPathNavigator(pathIndex: number, options: {}): PathNavigator;

  getPathNavigators(): any[];

  clearPathNavigators();

  getSelectedPathData(): any;

  getSelectedPathIndex(): number;

  isSelectedPathIndex(pathIndex: number): boolean;

  setSelectedPathIndex(pathIndex: number);

  render();

  renderLater(delay: number[]);

  setData(data: any[]);

  setFitView(pathIndex: number);

  on(eventName: String, handler: Function);

  off(eventName: String, handler: Function);

  hide();

  show();

  isHidden(): boolean;

  getRender(): boolean;

  getRenderOptions(): any;
}

interface PathNavigatorOptions {
  loop?: boolean;
  speed?: number;
  pathNavigatorStyle?: {};
  animInterval?: number;
  dirToPosInMillsecs?: number;
  range?: number[];
}

class PathNavigator {
  constructor(options: PathNavigatorOptions);

  start(pointIndex?: number);

  pause();

  resume();

  stop();

  destroy();

  getCursor(): any;

  getNaviStatus(): string;

  getPathIndex(): number;

  getPosition(): [number, number];

  getSpeed(): number;

  getMovedDistance(): number;

  getPathStartIdx(): number;

  getPathEndIdx(): number;

  moveByDistance(distance: number);

  moveToPoint(idx: number, tail: number);

  isCursorAtPathEnd(): boolean;

  isCursorAtPathStart(): boolean;

  setSpeed(speed: number);

  setRange(startIndex: number, endIndex: number);

  on(eventName: String, handler: Function);

  off(eventName: String, handler: Function);
}

type PathNavigatorType = PathNavigator;
type PathSimplifierType = PathSimplifier;
