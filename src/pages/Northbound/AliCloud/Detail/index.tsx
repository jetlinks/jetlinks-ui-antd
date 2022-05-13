import { PermissionButton, TitleComponent } from '@/components';
import { PageContainer } from '@ant-design/pro-layout';
import {
  ArrayCollapse,
  ArrayItems,
  Form,
  FormButtonGroup,
  FormGrid,
  FormItem,
  Input,
  Select,
} from '@formily/antd';
import type { Field } from '@formily/core';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField, observer } from '@formily/react';
import { Card, Col, Image, message, Row } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'umi';
import { useAsyncDataSource } from '@/utils/util';
import './index.less';
import { service } from '@/pages/Northbound/AliCloud';
import usePermissions from '@/hooks/permission';

const Detail = observer(() => {
  const params = useParams<{ id: string }>();
  const [dataList, setDataList] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {
          onFieldValueChange('accessConfig.*', async (field, f) => {
            const regionId = field.query('accessConfig.regionId').value();
            const accessKeyId = field.query('accessConfig.accessKeyId').value();
            const accessSecret = field.query('accessConfig.accessSecret').value();
            if (regionId && accessKeyId && accessSecret) {
              const response = await service.getAliyunProductsList({
                regionId,
                accessKeyId,
                accessSecret,
              });
              f.setFieldState(field.query('bridgeProductKey'), (state) => {
                state.dataSource = response;
                setDataList(response);
              });
            } else {
              f.setFieldState(field.query('bridgeProductKey'), (state) => {
                state.dataSource = [];
                setDataList([]);
              });
            }
          });
        },
      }),
    [],
  );

  useEffect(() => {
    if (params.id) {
      service.detail(params.id).then((resp) => {
        if (resp.status === 200) {
          form.setValues(resp.result);
        }
      });
    }
  }, [params.id]);

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      Input,
      Select,
      ArrayItems,
      ArrayCollapse,
    },
  });

  const queryRegionsList = () => service.getRegionsList();

  const queryProductList = (f: Field) => {
    const items = form.getValuesIn('mappings')?.map((i: any) => i?.productId) || [];
    const checked = [...items];
    const index = checked.findIndex((i) => i === f.value);
    checked.splice(index, 1);
    if (productList?.length > 0) {
      return new Promise((resolve) => {
        const list = productList.filter((j: any) => !checked.includes(j.value));
        resolve(list);
      });
    } else {
      return service.getProductsList({ paging: false }).then((resp) => {
        setProductList(resp);
        return resp.filter((j: any) => !checked.includes(j.value));
      });
    }
  };

  const queryAliyunProductList = (f: Field) => {
    const items = form.getValuesIn('mappings')?.map((i: any) => i?.productKey) || [];
    const checked = [...items];
    const index = checked.findIndex((i) => i === f.value);
    checked.splice(index, 1);
    if (dataList?.length > 0) {
      return new Promise((resolve) => {
        const list = dataList.filter((j: any) => !checked.includes(j.value));
        resolve(list);
      });
    } else {
      const accessConfig = form.getValuesIn('accessConfig') || {};
      return service.getAliyunProductsList(accessConfig).then((resp) => {
        setDataList(resp);
        return resp.filter((j: any) => !checked.includes(j.value));
      });
    }
  };

  const schema: any = {
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
        ],
      },
      accessConfig: {
        type: 'object',
        properties: {
          regionId: {
            type: 'string',
            title: '服务地址',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: '请选择服务地址',
              showSearch: true,
              filterOption: (input: string, option: any) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
            },
            'x-decorator-props': {
              tooltip: '阿里云内部给每台机器设置的唯一编号',
            },
            'x-reactions': ['{{useAsyncDataSource(queryRegionsList)}}'],
          },
          accessKeyId: {
            type: 'string',
            title: 'accessKey',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入accessKey',
            },
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
            'x-decorator-props': {
              tooltip: '用于程序通知方式调用云服务API的用户标识',
            },
          },
          accessSecret: {
            type: 'string',
            title: 'accessSecret',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入accessSecret',
            },
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
            'x-decorator-props': {
              tooltip: '用于程序通知方式调用云服务费API的秘钥标识',
            },
          },
        },
      },
      bridgeProductKey: {
        type: 'string',
        title: '网桥产品',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: '请选择网桥产品',
          showSearch: true,
          filterOption: (input: string, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        },
        'x-decorator-props': {
          tooltip: '物联网平台对应的阿里云产品',
        },
      },
      mappings: {
        type: 'array',
        required: true,
        'x-component': 'ArrayCollapse',
        title: '产品映射',
        items: {
          type: 'object',
          required: true,
          'x-component': 'ArrayCollapse.CollapsePanel',
          'x-component-props': {
            header: '产品映射',
          },
          properties: {
            grid: {
              type: 'void',
              'x-component': 'FormGrid',
              'x-component-props': {
                minColumns: [24],
                maxColumns: [24],
              },
              properties: {
                type: 'object',
                productKey: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  title: '阿里云产品',
                  required: true,
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '请选择阿里云产品',
                    showSearch: true,
                    filterOption: (input: string, option: any) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                  },
                  'x-decorator-props': {
                    gridSpan: 12,
                    tooltip: '阿里云物联网平台产品标识',
                  },
                  'x-reactions': ['{{useAsyncDataSource(queryAliyunProductList)}}'],
                },
                productId: {
                  type: 'string',
                  title: '平台产品',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-decorator-props': {
                    gridSpan: 12,
                  },
                  'x-component-props': {
                    placeholder: '请选择平台产品',
                    showSearch: true,
                    filterOption: (input: string, option: any) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                  },
                  'x-reactions': ['{{useAsyncDataSource(queryProductList)}}'],
                },
              },
            },
            remove: {
              type: 'void',
              'x-component': 'ArrayCollapse.Remove',
            },
          },
        },
        properties: {
          addition: {
            type: 'void',
            title: '添加',
            'x-component': 'ArrayCollapse.Addition',
          },
        },
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
    const product = dataList.find((item) => item?.value === data?.bridgeProductKey);
    data.bridgeProductName = product?.label || '';
    const response: any = data.id ? await service.update(data) : await service.save(data);
    if (response.status === 200) {
      message.success('保存成功');
      history.back();
    }
  };

  const { getOtherPermission } = usePermissions('Northbound/AliCloud');

  return (
    <PageContainer>
      <Card>
        <Row gutter={24}>
          <Col span={14}>
            <TitleComponent data={'基本信息'} />
            <Form form={form} layout="vertical" onAutoSubmit={console.log}>
              <SchemaField
                schema={schema}
                scope={{
                  useAsyncDataSource,
                  queryRegionsList,
                  queryProductList,
                  queryAliyunProductList,
                }}
              />
              <FormButtonGroup.Sticky>
                <FormButtonGroup.FormItem>
                  <PermissionButton
                    type="primary"
                    isPermission={getOtherPermission(['add', 'update'])}
                    onClick={() => handleSave()}
                  >
                    保存
                  </PermissionButton>
                </FormButtonGroup.FormItem>
              </FormButtonGroup.Sticky>
            </Form>
          </Col>
          <Col span={10}>
            <div className="doc">
              <div className="url">
                阿里云物联网平台：
                <a
                  style={{ wordBreak: 'break-all' }}
                  href="https://help.aliyun.com/document_detail/87368.html"
                >
                  https://help.aliyun.com/document_detail/87368.html
                </a>
              </div>
              <h1>1. 概述</h1>
              <div>
                在特定场景下，设备无法直接接入阿里云物联网平台时，您可先将设备接入物联网云平台，再使用阿里云“云云对接SDK”，快速构建桥接服务，搭建物联网平台与阿里云物联网平台的双向数据通道。
              </div>
              <div className={'image'}>
                <Image width="100%" src={require('/public/images/northbound/aliyun2.png')} />
              </div>
              <h1>2.配置说明</h1>
              <div>
                <h2> 1、服务地址</h2>
                <div>
                  阿里云内部给每台机器设置的唯一编号。请根据购买的阿里云服务器地址进行选择。
                </div>
                <h2> 2、AccesskeyID/Secret</h2>
                <div>
                  用于程序通知方式调用云服务费API的用户标识和秘钥获取路径：“阿里云管理控制台”--“用户头像”--“”--“AccessKey管理”--“查看”
                </div>
                <div className={'image'}>
                  <Image width="100%" src={require('/public/images/northbound/aliyun1.jpg')} />
                </div>
                <h2> 3. 网桥产品</h2>
                <div>
                  物联网平台对于阿里云物联网平台，是一个网关设备，需要映射到阿里云物联网平台的具体产品
                </div>
                <h2> 4. 产品映射</h2>
                <div>将阿里云物联网平台中的产品实例与物联网平台的产品实例进行关联</div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
});

export default Detail;
