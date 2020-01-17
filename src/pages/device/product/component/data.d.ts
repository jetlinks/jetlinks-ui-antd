
export class FunctionMeta {
    id: string;
    name: string;
    mark: string;
    inputs: Parameter[];
    outputs: ValueType;
    isAsync: boolean | string;
    description: string;
}

//输入输出参数
export class Parameter {
    id: string;
    name: string;
    dataType: string;
    valueType: ValueType;
    description: string;
}

//参数类型
export class ValueType {
    unit: string;
    min?: string;
    max?: string;
    step?: number;
    text?: string;
    true?: string;
    length?: number;
    false?: string;
    dateTemplate?: string;
    arrayType?: string;
    fileType?: string;
    elementNumber?: number;
    type: string;
    elements?: any[];
    description: string;
    parameter?: Parameter[]
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
    }
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
    parameter: Parameter[];
    description: string;
}
