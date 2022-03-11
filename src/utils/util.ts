import moment from 'moment';
import type { Field, FieldDataSource } from '@formily/core';
import { action } from '@formily/reactive';

/**
 * 把数据下载成JSON
 * @param record
 * @param fileName
 */
export const downloadObject = (record: Record<string, unknown>, fileName: string) => {
  // 创建隐藏的可下载链接
  const ghostLink = document.createElement('a');
  ghostLink.download = `${fileName}-${
    record?.name || moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
  }.json`;
  ghostLink.style.display = 'none';
  //字符串内容转成Blob地址
  const blob = new Blob([JSON.stringify(record)]);
  ghostLink.href = URL.createObjectURL(blob);
  //触发点击
  document.body.appendChild(ghostLink);
  ghostLink.click();
  //移除
  document.body.removeChild(ghostLink);
};

export const useAsyncDataSource =
  (services: (arg0: Field) => Promise<FieldDataSource>) => (field: Field) => {
    field.loading = true;
    services(field).then(
      action.bound!((resp: any) => {
        field.dataSource = resp;
        field.loading = false;
      }),
    );
  };

export const getDateFormat = (
  date: moment.MomentInput,
  format: string = 'YYYY-MM-DD HH:mm:ss',
): string => {
  return date ? moment(date).format(format) : '-';
};
