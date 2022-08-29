import { PermissionButton, TitleComponent } from '@/components';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row } from 'antd';
import styles from './index.less';
import {
  ArrayCollapse,
  Form,
  FormButtonGroup,
  FormItem,
  Input,
  Select,
  Radio,
} from '@formily/antd';
import { useEffect, useMemo, useState } from 'react';
import { createSchemaField } from '@formily/react';
import { createForm } from '@formily/core';
import { useAsyncDataSource } from '@/utils/util';
import { service } from '../index';

const Save = () => {
  const { permission } = PermissionButton.usePermission('system/Apply');
  const [view, setView] = useState<boolean>(false);

  const provider1 = require('/public/images/apply/provider1.png');
  const provider2 = require('/public/images/apply/provider2.png');
  const provider3 = require('/public/images/apply/provider3.png');
  const provider4 = require('/public/images/apply/provider4.png');
  const provider5 = require('/public/images/apply/provider5.png');

  const providerType = new Map();
  providerType.set('internal-standalone', provider1);
  providerType.set('internal-integrated', provider2);
  providerType.set('dingtalk-ent-app', provider3);
  providerType.set('wechat-webapp', provider4);
  providerType.set('third-party', provider5);

  const createImageLabel = (image: string, text: string) => {
    return (
      <div
        style={{ textAlign: 'center', marginTop: 10, fontSize: '14px', width: 115, height: 120 }}
      >
        <img height="64px" src={image} style={{ marginTop: 10 }} />
        <div
          style={{
            color: '#000000',
            marginTop: 5,
          }}
        >
          {text}
        </div>
      </div>
    );
  };

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      Radio,
      ArrayCollapse,
    },
  });

  const getProvidersAll = () => {
    return service.getProvidersAll().then((res) => {
      if (res.status === 200) {
        return res.result.map((item: any) => ({
          label: createImageLabel(providerType.get(item.provider), item.name),
          value: item.provider,
        }));
      }
    });
  };

  const form = useMemo(() => createForm({}), []);
  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: '名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入名称',
        },
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
          {
            required: true,
            message: '请输入名称',
          },
        ],
      },
      provider: {
        title: '应用',
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-component-props': {
          optionType: 'button',
          placeholder: '请选择应用',
        },
        required: true,
        'x-reactions': '{{useAsyncDataSource(getProvidersAll)}}',
        'x-decorator-props': {
          gridSpan: 1,
        },
        'x-validator': [
          {
            required: true,
            message: '请选择应用',
          },
        ],
      },
      description: {
        title: '说明',
        'x-component': 'Input.TextArea',
        'x-decorator': 'FormItem',
        'x-component-props': {
          rows: 3,
          showCount: true,
          maxLength: 200,
          placeholder: '请输入说明',
        },
      },
    },
  };

  useEffect(() => {
    setView(false);
  }, []);
  return (
    <PageContainer>
      <Card>
        <Row gutter={24}>
          <Col span={14}>
            <TitleComponent data={'基本信息'} />
            <Form form={form} layout="vertical" className={styles.form}>
              <SchemaField
                schema={schema}
                scope={{
                  useAsyncDataSource,
                  getProvidersAll,
                }}
              />
              <FormButtonGroup.Sticky>
                <FormButtonGroup.FormItem>
                  {!view && (
                    <PermissionButton
                      type="primary"
                      isPermission={permission.add || permission.update || true}
                      // onClick={() => handleSave()}
                    >
                      保存
                    </PermissionButton>
                  )}
                </FormButtonGroup.FormItem>
              </FormButtonGroup.Sticky>
            </Form>
          </Col>
          <Col span={10} className={styles.apply}>
            <div className={styles.doc}>文档</div>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};
export default Save;
