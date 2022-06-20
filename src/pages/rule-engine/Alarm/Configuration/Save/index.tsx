import { Modal, Typography } from 'antd';
import { useMemo } from 'react';
import { createForm, Field, onFieldInit, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormGrid, FormItem, Input, Radio, Select } from '@formily/antd';
import { ISchema } from '@formily/json-schema';
import { PermissionButton } from '@/components';
import { PlusOutlined } from '@ant-design/icons';
import Service from '@/pages/rule-engine/Alarm/Configuration/service';
import { onlyMessage, useAsyncDataSource } from '@/utils/util';
import styles from './index.less';
import { service as ConfigService } from '../../Config';
import { Store } from 'jetlinks-store';
import encodeQuery from '@/utils/encodeQuery';

interface Props {
  visible: boolean;
  close: () => void;
  data: any;
}

const alarm1 = require('/public/images/alarm/alarm1.png');
const alarm2 = require('/public/images/alarm/alarm2.png');
const alarm3 = require('/public/images/alarm/alarm3.png');
const alarm4 = require('/public/images/alarm/alarm4.png');
const alarm5 = require('/public/images/alarm/alarm5.png');

const service = new Service('alarm/config');

const createImageLabel = (image: string, text: string) => {
  return (
    <div style={{ textAlign: 'center', marginTop: 10, fontSize: '15px', width: '90px' }}>
      <img alt="" height="40px" src={image} />
      <Typography.Text style={{ maxWidth: '50px', marginBottom: 10 }} ellipsis={{ tooltip: text }}>
        {text}
      </Typography.Text>
    </div>
  );
};

const Save = (props: Props) => {
  const { visible, close } = props;

  const LevelMap = {
    1: alarm1,
    2: alarm2,
    3: alarm3,
    4: alarm4,
    5: alarm5,
  };
  const getLevel = () => {
    return ConfigService.queryLevel().then((resp) => {
      if (resp.status === 200) {
        return resp.result?.levels?.map((item: { level: number; title: string }) => ({
          label: createImageLabel(LevelMap[item.level], item.title),
          value: item.level,
        }));
      }
    });
  };

  const form = useMemo(
    () =>
      createForm({
        initialValues: props.data,
        validateFirst: true,
        effects() {
          onFieldInit('*(sceneId,targetType)', async (field) => {
            if (!props?.data?.id) return;
            const resp = await service.getAlarmCountById(props.data.id);
            field.setComponentProps({
              disabled: resp.result > 0,
            });
          });
          onFieldValueChange('targetType', async (field: Field, f) => {
            if (field.modified) {
              f.setFieldState(field.query('.sceneId'), (state) => {
                state.value = undefined;
              });
            }
          });
        },
      }),
    [props.data, props.visible],
  );

  const getScene = () => {
    const map = {
      product: 'device',
      device: 'device',
      org: 'device',
      other: undefined,
    };
    return service
      .getScene(
        encodeQuery({
          terms: {
            triggerType: map[form.getValuesIn('targetType')],
          },
        }),
      )
      .then((resp) => {
        Store.set('scene-data', resp.result);
        return form.getValuesIn('targetType')
          ? resp.result.map((item: { id: string; name: string }) => ({
              label: item.name,
              value: item.id,
            }))
          : [];
      });
  };

  const getSupports = () => service.getTargetTypes();

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      FormGrid,
      Radio,
    },
  });

  const handleSave = async () => {
    const data: any = await form.submit();
    const list = Store.get('scene-data');
    const scene = list.find((item: any) => item.id === data.sceneId);

    const resp: any = await service.update({
      ...data,
      state: 'disabled',
      sceneTriggerType: scene.triggerType,
      sceneName: scene.name,
    });

    if (resp.status === 200) {
      onlyMessage('操作成功');
      props.close();
    }
  };

  const { permission } = PermissionButton.usePermission('rule-engine/Scene');

  const schema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-decorator': 'FormGrid',
        'x-decorator-props': {
          maxColumns: 2,
          minColumns: 2,
          columnGap: 24,
        },
        properties: {
          name: {
            title: '名称',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-component-props': {
              placeholder: '请输入名称',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入名称',
              },
            ],
          },
          targetType: {
            title: '类型',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-decorator-props': {
              gridSpan: 1,
            },
            required: true,
            'x-reactions': '{{useAsyncDataSource(getSupports)}}',
            'x-component-props': {
              placeholder: '请选择类型',
            },
            'x-validator': [
              {
                required: true,
                message: '请选择类型',
              },
            ],
          },
        },
      },
      level: {
        title: '级别',
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-component-props': {
          optionType: 'button',
          placeholder: '请选择类型',
        },
        required: true,
        'x-reactions': '{{useAsyncDataSource(getLevel)}}',
        'x-decorator-props': {
          gridSpan: 1,
        },
        'x-validator': [
          {
            required: true,
            message: '请选择级别',
          },
        ],
      },
      sceneId: {
        title: '关联触发场景',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-reactions': '{{useAsyncDataSource(getScene)}}',
        'x-validator': [
          {
            required: true,
            message: '请选择关联触发场景',
          },
        ],
        'x-component-props': {
          placeholder: '请选择关联触发场景',
          showSearch: true,
          showArrow: true,
          filterOption: (input: string, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        },
        'x-decorator-props': {
          gridSpan: 1,
          addonAfter: (
            <PermissionButton
              type="link"
              style={{ padding: 0 }}
              isPermission={permission.add}
              onClick={() => {
                const tab: any = window.open(`${origin}/#/iot/rule-engine/scene/Save`);
                tab!.onTabSaveSuccess = (value: any) => {
                  form.setFieldState('sceneId', async (state) => {
                    state.dataSource = await getScene();
                    state.value = value?.result?.id;
                  });
                };
              }}
            >
              <PlusOutlined />
            </PermissionButton>
          ),
        },
      },
      description: {
        title: '说明',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-decorator-props': {
          gridSpan: 1,
        },
        'x-component-props': {
          placeholder: '请输入说明',
        },
        'x-validator': [
          {
            max: 200,
            message: '最多可输入200个字符',
          },
        ],
      },
    },
  };

  return (
    <Modal
      width="40vw"
      visible={visible}
      onOk={handleSave}
      forceRender={true}
      onCancel={() => close()}
      title={`${props.data ? '编辑' : '新增'}告警`}
    >
      <Form className={styles.form} form={form} layout="vertical">
        <SchemaField
          schema={schema}
          scope={{ useAsyncDataSource, getSupports, getLevel, getScene }}
        />
      </Form>
    </Modal>
  );
};
export default Save;
