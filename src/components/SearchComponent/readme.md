### 字段数据由后端提供

```
{
  title: '测试字段',
    dataIndex
:
  'test',
    valueType
:
  'select',
    align
:
  'center',
    request
:
  () => request(
    '/jetlinks/dictionary/device-log-type/items'
  )
    .then(response => response.result.map((item: {
                                             text: string,
                                             value: string
                                           }
    ) => ({
      label: item.text,
      value: item.value
    }))),
}
,
```

### `valueType` 对应类型

- `digit` 数字类型
- `dateTime` 日期时间

## defaultParams 默认查询参数不展示到 UI 上

支持两种类型的默认参数

```
const a = {[{column: 'test', value: 'admin'}]};

const b = {
  [
    {
      terms: [{column: 'parentId$isnull', value: ''}, {column: 'parentId$not', value: 'test', type: 'or'}],
    },
{
  terms: [{column: 'id$not', value: 'test', type: 'and'}],
}
,
]
}
```

## initParam 默认查询参数，展示到 UI 上

```
{[
  {
    terms: [
      {
        column: 'name',
        termType: 'eq',
        value: '123'
      },
      {
        column: 'name',
        termType: 'eq',
        value: '444'
      },
      {
        column: 'name',
        termType: 'eq',
        value: '555'
      },
      {
        column: 'name',
        termType: 'eq',
        value: '666'
      },
      {
        column: 'username',
        termType: 'eq',
        value: 'username',
        type: 'and'
      }
    ],
    type: 'or'
  },
  {
    terms: [
      {
        column: 'name',
        termType: 'eq',
        value: '132323'
      },
      {
        column: 'name',
        termType: 'eq',
        value: '22'
      },
      {
        column: 'name',
        termType: 'eq',
        value: '333'
      },
      {
        column: 'name',
        termType: 'eq',
        value: '444'
      },
      {
        column: 'username',
        termType: 'eq',
        value: '123123',
        type: 'and'
      }
    ],
    type: 'or'
  },
]}
```
