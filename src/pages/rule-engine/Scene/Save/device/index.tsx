import { ReactChild, useEffect } from 'react';
import Terms from '@/pages/rule-engine/Scene/Save/terms';
import { AddButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import { useState } from 'react';
import { Observer } from '@formily/react';
import AddModel from './addModel';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import classNames from 'classnames';
import { observer } from '@formily/reactive-react';
import { service } from '@/pages/device/Product/index';
import { Store } from 'jetlinks-store';
import { TriggerDeviceModel } from './addModel';
import { handleMetadata } from './product';
import { set } from 'lodash';
import { Form, FormInstance } from 'antd';
import { AIcon, TitleComponent } from '@/components';

const defaultDeviceValue = {
  productId: '',
  selector: 'fixed',
  selectorValues: [],
};

interface Props {
  form: FormInstance;
}

export default observer((props: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (FormModel.current.trigger!.device?.productId) {
      service.detail(FormModel.current.trigger!.device?.productId).then((res) => {
        if (res.status === 200) {
          TriggerDeviceModel.productDetail = res.result;
          handleMetadata(res.result.metadata);
        } else {
          Store.set('TriggerDeviceModel', {
            update: true,
          });
        }
      });
    }
  }, [FormModel.current.trigger!.device?.productId]);

  const handleLabel = (options: any): ReactChild | ReactChild[] => {
    if (!options || !Object.keys(options).length) return '点击配置设备触发';

    const _label = [
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {options.selectorIcon ? <AIcon type={options.selectorIcon} /> : null}
        <span className="trigger-options-name">{options.name}</span>
        {options.extraName ? <span>{options.extraName}</span> : null}
      </div>,
    ];
    if (!options.onlyName) {
      if (options.productName) {
        _label.push(<span className="trigger-options-type">{options.productName}</span>);
      }
      if (options.when) {
        _label.push(<span className="trigger-options-when">{options.when}</span>);
      }
      if (options.time) {
        _label.push(<span className="trigger-options-time">{options.time}</span>);
      }
      if (options.extraTime) {
        _label.push(<span className="trigger-options-extraTime">{options.extraTime}</span>);
      }
      if (options.action) {
        _label.push(<span className="trigger-options-action">{options.action}</span>);
      }
      if (options.type) {
        _label.push(<span className="trigger-options-type">{options.type}</span>);
      }
    }
    return _label;
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Observer>
          {() => {
            const label = handleLabel(FormModel.current.options?.trigger);
            return (
              <Form.Item
                label={<TitleComponent style={{ fontSize: 14 }} data={'触发规则'} />}
                name={'device'}
                rules={[
                  {
                    validator(_, v) {
                      if (!v) {
                        return Promise.reject(new Error('请配置设备触发规则'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <AddButton
                  style={{ width: '100%' }}
                  onClick={() => {
                    setVisible(true);
                  }}
                >
                  <div
                    className={classNames('trigger-options-content', {
                      'is-add': !!Object.keys(FormModel.current.options?.trigger || {}).length,
                    })}
                  >
                    {label}
                  </div>
                </AddButton>
              </Form.Item>
            );
          }}
        </Observer>
      </div>
      <Terms form={props.form} />
      {visible && (
        <AddModel
          value={FormModel.current.trigger?.device || defaultDeviceValue}
          options={FormModel.current.options?.trigger}
          onSave={(data, options) => {
            setVisible(false);
            set(FormModel.current, ['options', 'trigger'], options);
            set(FormModel.current, ['trigger', 'device'], data);
            props.form.setFieldValue('device', data);
            props.form.validateFields(['device']);
          }}
          onCancel={() => {
            setVisible(false);
          }}
        />
      )}
    </div>
  );
});
