export default function encodeQueryParam(params: any) {
  if (!params) return {};
  const queryParam = {};
  //格式化查询参数
  const terms = params.terms;
  const sorts = params.sorts;
  for (const key in params) {
    if (key === 'terms') {
      let index = 0;
      for (const k in terms) {
        if (terms[k] === '' || terms[k] === undefined) {
          continue;
        }
        if (k.indexOf('$LIKE') > -1 && terms[k].toString().indexOf('%') === -1) {
          terms[k] = `%${terms[k]}%`;
        } else if (k.indexOf('$START') > -1) {
          terms[k] = `%${terms[k]}`;
        } else if (k.indexOf('$END') > -1) {
          terms[k] = `${terms[k]}%`;
        }
        queryParam[`terms[${index}].column`] = k;
        queryParam[`terms[${index}].value`] = terms[k];
        index++;
      }
    } else if (key === 'sorts') {
      //当前Ant Design排序只支持单字段排序
      if (Object.keys(sorts).length > 0) {
        queryParam[`sorts[0].name`] = sorts.field;
        queryParam[`sorts[0].order`] = sorts.order.replace('end', '');
      }
      //多字段排序
      // let index = 0;
      // for (const k in sorts) {
      //   if (sorts[k] === '' || sorts[k] === undefined) {
      //     continue;
      //   }
      //   queryParam[`sorts[${index}].name`] = k;
      //   queryParam[`sorts[${index}].order`] = sorts[k];
      // }
    } else {
      queryParam[key] = params[key];
    }
  }
  return queryParam;
}
