import { productModel, service } from '@/pages/device/Product';
import { Button, Descriptions } from 'antd';
import { useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { EditOutlined } from '@ant-design/icons';
import { getDateFormat } from '@/utils/util';
import Save from '@/pages/device/Product/Save';
import { PermissionButton } from '@/components';

// const componentMap = {
//   string: 'Input',
//   password: 'Password',
// };

interface BaseInfoProps {
  onJump?: (type?: string) => void;
}

const BaseInfo = (props: BaseInfoProps) => {
  const intl = useIntl();
  // const [metadata, setMetadata] = useState<ConfigMetadata[]>([]);
  // const [state, setState] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const { permission } = PermissionButton.usePermission('device/Product');

  // const form = createForm({
  //   validateFirst: true,
  //   readPretty: state,
  //   initialValues: productModel.current?.configuration,
  // });

  const id = productModel.current?.id;

  // useEffect(() => {
  //   if (id) {
  //     service.getConfigMetadata(id).then((config: { result: SetStateAction<ConfigMetadata[]> }) => {
  //       setMetadata(config.result);
  //     });
  //   }
  // }, [productModel.current]);

  // const SchemaField = createSchemaField({
  //   components: {
  //     Password,
  //     FormGrid,
  //     PreviewText,
  //     FormItem,
  //     Input,
  //   },
  // });

  // const configToSchema = (data: ConfigProperty[]) => {
  //   const config = {};
  //   data.forEach((item) => {
  //     config[item.property] = {
  //       type: 'string',
  //       title: item.name,
  //       'x-decorator': 'FormItem',
  //       'x-component': componentMap[item.type.type],
  //       'x-decorator-props': {
  //         tooltip: item.description,
  //       },
  //     };
  //   });
  //   return config;
  // };

  const getDetailInfo = () => {
    service.getProductDetail(id || '').subscribe((data) => {
      if (data) {
        productModel.current = {
          ...productModel.current,
          ...data,
        };
      }
    });
  };

  // const renderConfigCard = () => {
  //   return (
  //     metadata &&
  //     metadata.length > 0 &&
  //     metadata?.map((item) => {
  //       const itemSchema: ISchema = {
  //         type: 'object',
  //         properties: {
  //           grid: {
  //             type: 'void',
  //             'x-component': 'FormGrid',
  //             'x-component-props': {
  //               minColumns: [2],
  //               maxColumns: [2],
  //             },
  //             properties: configToSchema(item.properties),
  //           },
  //         },
  //       };

  //       return (
  //         <>
  //           <Divider />
  //           <Card
  //             key={item.name}
  //             title={item.name}
  //             extra={
  //               <a
  //                 onClick={async () => {
  //                   if (!state) {
  //                     const values = (await form.submit()) as any;
  //                     const resp = await service.modify(id || '', {
  //                       id,
  //                       configuration: { ...values },
  //                     });
  //                     if (resp.status === 200) {
  //                       message.success('操作成功！');
  //                       getDetailInfo();
  //                     }
  //                   }
  //                   setState(!state);
  //                 }}
  //               >
  //                 {state ? (
  //                   <>
  //                     {intl.formatMessage({
  //                       id: 'pages.data.option.edit',
  //                       defaultMessage: '编辑',
  //                     })}
  //                   </>
  //                 ) : (
  //                   <>
  //                     {intl.formatMessage({
  //                       id: 'pages.device.productDetail.base.save',
  //                       defaultMessage: '保存',
  //                     })}
  //                   </>
  //                 )}
  //               </a>
  //             }
  //           >
  //             <PreviewText.Placeholder value="-">
  //               <Form form={form}>
  //                 <FormLayout labelCol={6} wrapperCol={16}>
  //                   <SchemaField schema={itemSchema} />
  //                 </FormLayout>
  //               </Form>
  //             </PreviewText.Placeholder>
  //           </Card>
  //         </>
  //       );
  //     })
  //   );
  // };

  return (
    <>
      <Descriptions
        size="small"
        column={3}
        title={[
          <span key={1}>产品信息</span>,
          <PermissionButton
            isPermission={permission.update}
            key={2}
            type={'link'}
            onClick={() => {
              setVisible(true);
            }}
          >
            <EditOutlined />
          </PermissionButton>,
        ]}
        bordered
      >
        <Descriptions.Item label={'ID'}>{productModel.current?.id}</Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.device.productDetail.classifiedName',
            defaultMessage: '所属品类',
          })}
        >
          {productModel.current?.classifiedName}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.device.instanceDetail.deviceType',
            defaultMessage: '设备类型',
          })}
        >
          {productModel.current?.deviceType ? productModel.current?.deviceType.text : '-'}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.device.productDetail.transportProtocol',
            defaultMessage: '接入方式',
          })}
        >
          {permission.update ? (
            productModel.current?.transportProtocol ? (
              <Button
                type={'link'}
                style={{ padding: 0 }}
                onClick={() => {
                  if (props.onJump) {
                    props.onJump('access');
                  }
                }}
              >
                {productModel.current?.transportProtocol}
              </Button>
            ) : (
              <Button
                type={'link'}
                style={{ padding: 0 }}
                onClick={() => {
                  if (props.onJump) {
                    props.onJump('access');
                  }
                }}
              >
                配置接入方式
              </Button>
            )
          ) : (
            productModel.current?.transportProtocol
          )}
        </Descriptions.Item>

        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.device.productDetail.createTime',
            defaultMessage: '创建时间',
          })}
        >
          {getDateFormat(productModel.current?.createTime)}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.device.productDetail.updateTime',
            defaultMessage: '更新时间',
          })}
        >
          {getDateFormat(productModel.current?.updateTime)}
        </Descriptions.Item>
        <Descriptions.Item
          span={3}
          label={intl.formatMessage({
            id: 'pages.device.productDetail.metadata.describe',
            defaultMessage: '描述',
          })}
        >
          {productModel.current?.describe}
        </Descriptions.Item>
      </Descriptions>
      <Save
        model={'edit'}
        data={productModel.current}
        close={() => {
          setVisible(false);
        }}
        reload={getDetailInfo}
        visible={visible}
      />
      {/* {renderConfigCard()} */}
    </>
  );
};
export default BaseInfo;
