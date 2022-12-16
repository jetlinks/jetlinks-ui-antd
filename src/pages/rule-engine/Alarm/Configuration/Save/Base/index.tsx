import Service from '@/pages/rule-engine/Alarm/Configuration/service';
import { Typography } from 'antd';
import { service as ConfigService } from '@/pages/rule-engine/Alarm/Config';
import { useMemo, useState } from 'react';
import { createForm, onFormInit } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormGrid, FormItem, Input, Radio, Select } from '@formily/antd';
import { onlyMessage, useAsyncDataSource } from '@/utils/util';
import { PermissionButton } from '@/components';
import { ISchema } from '@formily/json-schema';
import styles from '@/pages/rule-engine/Alarm/Configuration/Save/Base/index.less';
import useLocation from '@/hooks/route/useLocation';
import { getMenuPathByCode } from '@/utils/menu';
import { useHistory } from 'umi';
import { service as sceneService } from '@/pages/rule-engine/Scene';
import { Store } from 'jetlinks-store';

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

export default () => {
  const { getOtherPermission } = PermissionButton.usePermission('rule-engine/Alarm/Configuration');
  const history = useHistory();
  const location = useLocation();
  const id = location?.query?.id || '';
  const [loading, setLoading] = useState<boolean>(false);

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
        return resp.result?.levels
          ?.filter((i: any) => i?.level && i?.title)
          .map((item: { level: number; title: string }) => ({
            label: createImageLabel(LevelMap[item.level], item.title),
            value: item.level,
          }));
      }
    });
  };

  const form = useMemo(
    () =>
      createForm({
        initialValues: {},
        validateFirst: true,
        effects() {
          onFormInit(async (form1) => {
            if (!id) return;
            const resp = await service.detail(id);
            Store.set('configuration-data', resp.result);
            form1.setInitialValues({ ...resp.result });
            const resp1 = await sceneService.query({
              terms: [
                {
                  terms: [
                    {
                      column: 'id',
                      termType: 'alarm-bind-rule',
                      value: id,
                    },
                  ],
                  type: 'and',
                },
              ],
              sorts: [
                {
                  name: 'createTime',
                  order: 'desc',
                },
              ],
            });
            if (resp1.status === 200) {
              form1.setFieldState('.targetType', (state) => {
                state.disabled = !!resp1.result.data?.length;
              });
            }
          });
        },
      }),
    [id],
  );

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
    setLoading(true);
    const resp: any = await service.update({ ...data });
    setLoading(false);
    if (resp.status === 200) {
      onlyMessage('操作成功');
      const url = getMenuPathByCode('rule-engine/Alarm/Configuration/Save');
      history.push(`${url}?id=${resp.result?.id || id}`);
      if (!id) {
        Store.set('configuration-data', resp.result);
      }
    }
  };

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
              {
                max: 64,
                message: '最多可输入64个字符',
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
    <div>
      <Form className={styles.form} form={form} layout="vertical">
        <SchemaField schema={schema} scope={{ useAsyncDataSource, getSupports, getLevel }} />
        <PermissionButton
          type="primary"
          loading={loading}
          isPermission={getOtherPermission(['add', 'update'])}
          onClick={() => handleSave()}
        >
          保存
        </PermissionButton>
      </Form>
    </div>
  );
};
