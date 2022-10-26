import { RadioCard, TitleComponent } from '@/components';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, FormButtonGroup, FormGrid, FormItem, Input } from '@formily/antd';
import { createForm, onFormInit } from '@formily/core';
import { createSchemaField, observer } from '@formily/react';
import { Button, Card, Col, Row } from 'antd';
import { useEffect, useMemo } from 'react';
import { useParams } from 'umi';
import { useAsyncDataSource } from '@/utils/util';
// import './index.less';
import { service } from '@/pages/Northbound/AliCloud';
import { useModel } from '@@/plugin-model/useModel';

const Detail = observer(() => {
  const params = useParams<{ id: string }>();
  const { initialState } = useModel('@@initialState');

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {
          onFormInit(async (form1) => {
            if (params.id === ':id') return;
            const resp = await service.detail(params.id);
            form1.setInitialValues(resp.result);
          });
        },
      }),
    [],
  );

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      Input,
      RadioCard,
    },
  });

  const schema: any = {
    type: 'object',
    properties: {
      operatorName: {
        title: '平台类型',
        'x-component': 'RadioCard',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 1,
        },
        default: 'onelink',
        'x-component-props': {
          model: 'singular',
          itemStyle: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: '130px',
          },
          options: [
            {
              label: '移动OneLink',
              value: 'onelink',
              imgUrl: require('/public/images/iot-card/onelink.png'),
              imgSize: [78, 20],
            },
            {
              label: '电信Ctwing',
              value: 'ctwing',
              imgUrl: require('/public/images/iot-card/ctwingcmp.png'),
              imgSize: [52, 25],
            },
            {
              label: '联通Unicom',
              value: 'unicom',
              imgUrl: require('/public/images/iot-card/unicom.png'),
              imgSize: [56, 41],
            },
          ],
        },
        'x-validator': [
          {
            required: true,
            message: '请选择类型',
          },
        ],
      },
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

  const handleSave = async () => {
    const data: any = await form.submit();
    console.log(data);
  };

  useEffect(() => {
    setTimeout(() => {
      if (initialState?.settings?.title) {
        document.title = `物联卡 - ${initialState?.settings?.title}`;
      } else {
        document.title = '物联卡';
      }
    }, 0);
  }, []);

  return (
    <PageContainer>
      <Card>
        <Row gutter={24}>
          <Col span={12}>
            <TitleComponent data={'详情'} />
            <Form form={form} layout="vertical">
              <SchemaField
                schema={schema}
                scope={{
                  useAsyncDataSource,
                }}
              />
              <FormButtonGroup.Sticky>
                <FormButtonGroup.FormItem>
                  <Button type="primary" onClick={() => handleSave()}>
                    保存
                  </Button>
                </FormButtonGroup.FormItem>
              </FormButtonGroup.Sticky>
            </Form>
          </Col>
          <Col span={12} className="aliyun"></Col>
        </Row>
      </Card>
    </PageContainer>
  );
});

export default Detail;
