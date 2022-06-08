import PermissionButton from '@/components/PermissionButton';
import usePermissions from '@/hooks/permission';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, FormButtonGroup, FormItem } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { Card, Col, Input, message, Row } from 'antd';
import { createSchemaField, observer } from '@formily/react';
import { useEffect, useMemo } from 'react';
import { createForm } from '@formily/core';
import CertificateFile from './components/CertificateFile';
import Standard from './components/Standard';
import { service } from '@/pages/link/Certificate';
import { useParams } from 'umi';
import './index.less';

const Detail = observer(() => {
  const params = useParams<{ id: string }>();
  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
      }),
    [],
  );

  useEffect(() => {
    if (params.id && params.id !== ':id') {
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
      Input,
      CertificateFile,
      Standard,
    },
  });
  const schema: ISchema = {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        title: '证书标准',
        required: true,
        default: 'common',
        'x-decorator': 'FormItem',
        'x-component': 'Standard',
        'x-validator': [
          {
            required: true,
            message: '请选择证书标准',
          },
        ],
      },
      name: {
        type: 'string',
        title: '证书名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入证书名称',
        },
        'x-validator': [
          {
            required: true,
            message: '请输入证书名称',
          },
          {
            max: 64,
            message: '最多可输入64个字符',
          },
        ],
      },
      'configs.cert': {
        title: '证书文件',
        'x-component': 'CertificateFile',
        'x-decorator': 'FormItem',
        required: true,
        'x-component-props': {
          rows: 3,
          placeholder:
            '证书私钥格式以"-----BEGIN (RSA|EC) PRIVATE KEY-----"开头，以"-----END(RSA|EC) PRIVATE KEY-----"结尾。',
        },
        'x-validator': [
          {
            required: true,
            message: '请上传证书文件',
          },
        ],
      },
      'configs.key': {
        title: '证书私钥',
        'x-component': 'Input.TextArea',
        'x-decorator': 'FormItem',
        required: true,
        'x-component-props': {
          rows: 3,
          placeholder:
            '证书私钥格式以"-----BEGIN (RSA|EC) PRIVATE KEY-----"开头，以"-----END(RSA|EC) PRIVATE KEY-----"结尾。',
        },
        'x-validator': [
          {
            required: true,
            message: '请输入证书私钥',
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

  const { getOtherPermission } = usePermissions('link/Certificate');

  return (
    <PageContainer>
      <Card>
        <Row gutter={24}>
          <Col span={12}>
            <Form form={form} layout="vertical">
              <SchemaField schema={schema} />
              <FormButtonGroup.Sticky>
                <FormButtonGroup.FormItem>
                  <PermissionButton
                    type="primary"
                    isPermission={getOtherPermission(['add', 'update'])}
                    onClick={async () => {
                      const data: any = await form.submit();
                      const response: any = data.id
                        ? await service.update(data)
                        : await service.save(data);
                      if (response.status === 200) {
                        message.success('操作成功');
                        history.back();
                      }
                    }}
                  >
                    保存
                  </PermissionButton>
                </FormButtonGroup.FormItem>
              </FormButtonGroup.Sticky>
            </Form>
          </Col>
          <Col span={12}>
            <div className="doc">
              <h1>1. 概述</h1>
              <div>
                证书由受信任的数字证书颁发机构CA，在验证服务器身份后颁发，具有服务器身份验证和数据传输加密功能，保障设备与平台间的数据传输安全。配置后可被网络组件引用。
              </div>
              <h1>2. 配置说明</h1>
              <h2>1、证书文件</h2>
              <div>
                您可以使用文本编辑工具打开PEM或者CRT格式的证书文件，复制其中的内容并粘贴到该文本框，或者单击该文本框下的上传，并选择存储在本地计算机的证书文件，将文件内容上传到文本框。
              </div>
              <h2>2、证书私钥</h2>
              <div>
                填写证书私钥内容的PEM编码。
                您可以使用文本编辑工具打开KEY格式的证书私钥文件，复制其中的内容并粘贴到该文本框，或者单击该文本框下的上传并选择存储在本地计算机的证书私钥文件，将文件内容上传到文本框。
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
});

export default Detail;
