export class FunctionMeta {
  id: string;

  name: string;

  mark: string;

  inputs: Parameter[];

  output: ValueType;

  async: boolean | string;

  description: string;
}

// 输入输出参数
export class Parameter {
  id: string;

  name: string;

  dataType: string;

  valueType: ValueType;

  description: string;
}

// 参数类型
export class ValueType {
  unit: string;

  min?: string;

  max?: string;

  step?: number;

  scale?: number;

  text?: string;

  trueText?: string;

  trueValue?: string;

  falseText?: string;

  falseValue?: string;

  length?: number;

  latProperty: string;

  dateTemplate?: string;

  format?: string;

  elementType?: string | any;

  fileType?: string;

  elementNumber?: number;

  type: string;

  elements?: any[];

  enums?: any[];

  description: string;

  expands: {
    report: boolean;
    readOnly: boolean;
    maxLength: number;
  };

  properties?: Parameter[];
}

export class PropertiesMeta {
  id: string;

  name: string;

  type: string;

  valueType: ValueType;

  description?: string;

  expands: {
    report: boolean;
    readOnly: boolean;
    [name: string]: any
  };
}

export class TagsMeta {
  id: string;

  name: string;

  type: string;

  valueType: ValueType;

  description?: string;

  expands: {
    report: boolean;
    readOnly: boolean;
  };
}

export class EventsMeta {
  id: string;

  name: string;

  type: string;

  valueType: ValueType;

  expands: {
    level: string;
    eventType: string;
  };

  properties: Parameter[];

  description: string;
}
