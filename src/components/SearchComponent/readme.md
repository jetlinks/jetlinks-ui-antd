### 字段数据由后端提供

```typescript jsx
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
  () => request('/jetlinks/dictionary/device-log-type/items')
    .then(response =>
      response.result
        .map((item: { text: string, value: string }) =>
          ({ label: item.text, value: item.value }))),
}
,
```

### `valueType` 对应类型

- `digit` 数字类型
- `dateTime` 日期时间

## defaultParams

支持两种类型的默认参数

```typescript jsx
const a = { [{ column: 'test', value: 'admin' }] };

const b = {
  [
    {
      terms: [{ column: 'parentId$isnull', value: '' }, { column: 'parentId$not', value: 'test', type: 'or' }],
    },
    {
      terms: [{ column: 'id$not', value: 'test', type: 'and' }],
    },
  ]
}
```
