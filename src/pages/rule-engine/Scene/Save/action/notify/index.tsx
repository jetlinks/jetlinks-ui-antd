import { Modal, Button, Steps } from 'antd';
import { useEffect, useRef } from 'react';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import NotifyWay from './NotifyWay';
import NotifyConfig from './NotifyConfig';
import NotifyTemplate from './NotifyTemplate';
import VariableDefinitions from './VariableDefinitions';
import './index.less';
import { onlyMessage } from '@/utils/util';
import { queryMessageTemplateDetail } from '@/pages/rule-engine/Scene/Save/action/service';
import { NotifyProps } from '@/pages/rule-engine/Scene/typings';

interface Props {
  value: Partial<NotifyProps>;
  save: (notify: any, options: any) => void;
  options?: any;
  cancel: () => void;
  name: number;
}

export const NotifyModel = model<{
  steps: { key: string; title: string }[];
  current: number;
  notify: Partial<NotifyProps>;
  variable: any[];
  loading: boolean;
}>({
  steps: [
    {
      key: 'way',
      title: '通知方式',
    },
    {
      key: 'config',
      title: '通知配置',
    },
    {
      key: 'template',
      title: '通知模板',
    },
    {
      key: 'variable',
      title: '模板变量',
    },
  ],
  current: 0,
  notify: {
    notifyType: '',
    notifierId: '',
    templateId: '',
  },
  variable: [],
  loading: false,
});

export default observer((props: Props) => {
  const WayRef = useRef<{ save: any }>();
  const VariableRef = useRef<{ save: any }>();

  useEffect(() => {
    NotifyModel.notify = {
      ...props.value,
      options: { ...props.options },
    };
  }, [props.value, props.options]);

  const renderComponent = (type: string) => {
    switch (type) {
      case 'way':
        return <NotifyWay ref={WayRef} value={NotifyModel.notify?.notifyType} />;
      case 'config':
        return <NotifyConfig type={NotifyModel.notify.notifyType || ''} />;
      case 'template':
        return <NotifyTemplate type={NotifyModel.notify.notifyType || ''} />;
      case 'variable':
        return (
          <VariableDefinitions
            value={NotifyModel.notify.variables}
            name={props.name}
            ref={VariableRef}
          />
        );
      default:
        return null;
    }
  };

  const prev = () => {
    NotifyModel.current -= 1;
  };

  const next = async () => {
    NotifyModel.loading = true;
    if (NotifyModel.current === 0) {
      const val = await WayRef.current?.save();
      if (val) {
        NotifyModel.notify = {
          notifyType: val,
          notifierId: '',
          templateId: '',
        };
        NotifyModel.variable = [];
        NotifyModel.current += 1;
      }
    } else if (NotifyModel.current === 1) {
      if (NotifyModel.notify?.notifierId) {
        NotifyModel.current += 1;
      } else {
        onlyMessage('请选择通知配置', 'error');
      }
    } else if (NotifyModel.current === 2) {
      if (NotifyModel.notify?.templateId) {
        const resp = await queryMessageTemplateDetail(NotifyModel.notify.templateId);
        if (resp.status === 200) {
          NotifyModel.variable = resp.result?.variableDefinitions || [];
          NotifyModel.current += 1;
        }
      } else {
        onlyMessage('请选择通知模板', 'error');
      }
    } else if (NotifyModel.current === 3) {
      const resp = await VariableRef.current?.save();
      if (resp) {
        NotifyModel.notify.variables = resp;
        const { options, ...extra } = NotifyModel.notify;
        props.save(
          {
            notify: { ...extra },
            type: 'notify',
          },
          options,
        );
        NotifyModel.current = 0;
      }
    }
    NotifyModel.loading = false;
  };

  return (
    <Modal
      title={'执行动作'}
      open
      width={810}
      onCancel={() => {
        props.cancel();
        NotifyModel.current = 0;
      }}
      footer={
        <div className="steps-action">
          {NotifyModel.current === 0 && (
            <Button
              onClick={() => {
                props.cancel();
                NotifyModel.current = 0;
              }}
            >
              取消
            </Button>
          )}
          {NotifyModel.current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              上一步
            </Button>
          )}
          {NotifyModel.current < NotifyModel.steps.length - 1 && (
            <Button
              type="primary"
              loading={NotifyModel.loading}
              onClick={() => {
                next();
              }}
            >
              下一步
            </Button>
          )}
          {NotifyModel.current === NotifyModel.steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => {
                next();
              }}
            >
              确定
            </Button>
          )}
        </div>
      }
    >
      <div className="steps-steps">
        <Steps
          onChange={async (value: number) => {
            if (value === 0) {
              NotifyModel.current = value;
            }
            if (value === 1) {
              if (NotifyModel.notify.notifyType) {
                NotifyModel.current = value;
              } else {
                onlyMessage('请选择通知方式', 'error');
              }
            } else if (value === 2) {
              if (NotifyModel.notify.notifierId) {
                NotifyModel.current = value;
              } else {
                onlyMessage('请选择通知配置', 'error');
              }
            } else if (value === 3) {
              if (NotifyModel.notify.templateId) {
                const resp = await queryMessageTemplateDetail(NotifyModel.notify.templateId);
                if (resp.status === 200) {
                  NotifyModel.variable = resp.result?.variableDefinitions || [];
                  NotifyModel.current = value;
                }
              } else {
                onlyMessage('请选择通知模板', 'error');
              }
            }
          }}
          current={NotifyModel.current}
          items={NotifyModel.steps}
        />
      </div>
      <div className="steps-content">
        {renderComponent(NotifyModel.steps[NotifyModel.current]?.key)}
      </div>
    </Modal>
  );
});
