
export interface SQLConfig {
    dataSourcedId?: string, //数据源ID
    stream?: boolean, //流式结果
    transaction?: boolean, //使用事物
    script?: string, //SQL语句
} 