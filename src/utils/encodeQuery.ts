export default function encodeQuery (params: any) {
  if (!params) return {}
  const queryParam: any = {}
  const { terms, sorts } = params
  Object.keys(params).forEach((key: string) => {
    if (key === 'terms') {
      let index = 0
      if (!terms) return
      Object.keys(terms).forEach((k: string) => {
        if (
          !(
            terms[k] === '' ||
            terms[k] === undefined ||
            terms[k].length === 0 ||
            terms[k] === {} ||
            terms[k] === null
          )
        ) {
          if (k.indexOf('$LIKE') > -1 && terms[k].toString().indexOf('%') === -1) {
            terms[k] = `%${terms[k]}%`
          }
          if (k.indexOf('$IN') > -1) {
            terms[k] = terms[k].toString()
          } else if (k.indexOf('$START') > -1) {
            terms[k] = `%${terms[k]}`
          } else if (k.indexOf('$END') > -1) {
            terms[k] = `${terms[k]}%`
          }
          if (k.indexOf('@') > -1) {
            const temp = k.split('@')
            queryParam[`terms[${index}].column`] = temp[0]
            queryParam[`terms[${index}].type`] = temp[1]
          } else {
            queryParam[`terms[${index}].column`] = k
          }
          queryParam[`terms[${index}].value`] = terms[k]
          index += 1
        }
      })
    } else if (key === 'sorts') {
      if (!sorts) return
      Object.keys(sorts).forEach((s, index) => {
        queryParam[`sorts[${index}].name`] = s
        queryParam[`sorts[${index}].order`] = sorts[s].replace('end', '')
      })
    } else {
      queryParam[key] = params[key]
    }
  })
  return queryParam
}
