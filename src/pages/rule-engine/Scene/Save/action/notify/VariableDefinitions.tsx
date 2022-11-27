import { NotifyModel } from './index';
import { Empty } from '@/components';
import { Form, Input } from 'antd';
import User from './components/variableItem/user';
import Org from './components/variableItem/org';
import Tag from './components/variableItem/tag';
import BuildIn from './components/variableItem/buildIn';
import InputFile from './components/variableItem/inputFile';
import { forwardRef, useCallback, useImperativeHandle } from 'react';

interface Props {
  name: number;
}

export default forwardRef((props: Props, ref) => {
  const [form] = Form.useForm();
  const typeComponents = (item: any) => {
    const type = item.expands?.businessType || item.type;
    switch (type) {
      case 'user':
        return <User />;
      case 'org':
        return <Org />;
      case 'tag':
        return <Tag />;
      case 'file':
        return <InputFile />;
      case 'link':
        return <Input placeholder={'请输入' + item.name} />;
      default:
        return <BuildIn data={item} name={props.name} />;
    }
  };

  const getRules = useCallback(
    (item: any, type: string): any[] => {
      const rules: any[] = [];
      if (item?.required) {
        if (type === 'user') {
          rules.push({
            validator: async (_: any, value: any) => {
              if (!value) {
                return Promise.reject(new Error('请选择' + item.name));
              } else {
                if (value.source === 'fixed' && !value.value) {
                  return Promise.reject(new Error('请输入' + item.name));
                } else if (value.source === 'relation' && !value.value && !value.relation) {
                  return Promise.reject(new Error('请选择' + item.name));
                }
              }
              return Promise.resolve();
            },
          });
        } else {
          rules.push({
            validator: async (_: any, value: any) => {
              if (type === 'file' || type === 'link') {
                if (!value) {
                  return Promise.reject(new Error('请输入' + item.name));
                }
              } else {
                if (!value || !value.value) {
                  if (['date', 'org'].includes(type)) {
                    return Promise.reject(new Error('请选择' + item.name));
                  } else {
                    return Promise.reject(new Error('请输入' + item.name));
                  }
                }
              }
              return Promise.resolve();
            },
          });
        }
      }

      if (type === 'link') {
        rules.push({ max: 64, message: '最多64个字符' });
      }

      if (type === 'user') {
        if (NotifyModel.notify?.notifyType === 'email') {
          rules.push({
            validator: async (_: any, value: any) => {
              if (value.value) {
                const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                if (!reg.test(value.value)) {
                  return Promise.reject(new Error('请输入正确的邮箱地址'));
                }
              }
              return Promise.resolve();
            },
          });
        }

        if (
          NotifyModel.notify?.notifyType &&
          ['sms', 'voice'].includes(NotifyModel.notify?.notifyType)
        ) {
          rules.push({
            validator: async (_: any, value: any) => {
              if (value.value) {
                const reg = /^[1][3-9]\d{9}$/;
                if (!reg.test(value.value)) {
                  return Promise.reject(new Error('请输入正确的手机号码'));
                }
              }
              return Promise.resolve();
            },
          });
        }
      }

      return rules;
    },
    [NotifyModel.notify?.notifyType],
  );

  const saveBtn = () => {
    return new Promise(async (resolve) => {
      const formData = await form.validateFields().catch(() => {
        resolve(false);
      });
      if (formData) {
        console.log(formData);
        // resolve(formData);
      } else {
        resolve(false);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    save: saveBtn,
  }));

  return NotifyModel.variable.length ? (
    <div>
      <Form form={form} layout={'vertical'}>
        {(NotifyModel?.variable || []).map((item) => {
          const type = item.expands?.businessType || item.type;
          let initialValue = undefined;
          const rules = getRules(item, type);
          if (type === 'user') {
            initialValue = {
              source: 'relation',
              value: undefined,
            };
          } else if (['date', 'number', 'string'].includes(type)) {
            initialValue = {
              source: 'fixed',
              value: undefined,
            };
          }
          return (
            <Form.Item
              key={item.id}
              name={item.id}
              label={item.name}
              initialValue={initialValue}
              required={!!item.required}
              rules={rules}
            >
              {typeComponents(item)}
            </Form.Item>
          );
        })}
      </Form>
    </div>
  ) : (
    <Empty />
  );
});
