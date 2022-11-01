import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Image, Input, Radio, Row, Select, Tooltip } from 'antd';
import { useIntl, useLocation } from 'umi';
import { RadioCard, UploadImage } from '@/components';
import { PlusOutlined } from '@ant-design/icons';
import { service } from '../index';
import SaveProductModal from './SaveProduct';
import { getButtonPermission } from '@/utils/menu';
import { onlyMessage } from '@/utils/util';
import { PageContainer } from '@ant-design/pro-layout';
import styles from '../../Cascade/Save/index.less';
import { useDomFullHeight } from '@/hooks';

const DefaultAccessType = 'gb28181-2016';
const defaultImage = require('/public/images/device-media.png');

const Save = () => {
  const location: any = useLocation();
  const id = location?.query?.id;
  const intl = useIntl();
  const [form] = Form.useForm();
  const { minHeight } = useDomFullHeight(`.mediaDevice`);
  const [productVisible, setProductVisible] = useState(false);
  const [accessType, setAccessType] = useState(DefaultAccessType);
  const [productList, setProductList] = useState<any[]>([]);
  const [oldPassword, setOldPassword] = useState('');
  const img1 = require('/public/images/media/doc1.png');
  const img2 = require('/public/images/media/doc2.png');
  const img3 = require('/public/images/media/doc3.png');
  const img4 = require('/public/images/media/doc4.png');

  const getProductList = async (productParams: any) => {
    const resp = await service.queryProductList(productParams);
    if (resp.status === 200) {
      setProductList(resp.result);
    }
  };

  const queryProduct = async (value: string) => {
    getProductList({
      terms: [
        { column: 'accessProvider', value: value },
        { column: 'state', value: 1 },
      ],
      sorts: [{ name: 'createTime', order: 'desc' }],
    });
  };

  useEffect(() => {
    if (id) {
      service.getDetail(id).then((res) => {
        if (res.status === 200) {
          form.setFieldsValue({
            ...res.result,
            photoUrl: res.result?.photoUrl || defaultImage,
          });
          const _accessType = res.result?.provider || DefaultAccessType;
          setAccessType(_accessType);
          queryProduct(_accessType);
          setOldPassword(res.result.password);
        }
      });
    } else {
      form.setFieldsValue({
        provider: DefaultAccessType,
        photoUrl: defaultImage,
      });
      queryProduct(DefaultAccessType);
      setAccessType(DefaultAccessType);
    }
  }, []);

  const handleSave = useCallback(async () => {
    const formData = await form.validateFields();
    if (formData) {
      const { provider, ...extraFormData } = formData;
      if (formData.password === oldPassword && !id) {
        delete extraFormData.password;
      }
      if (formData.id === '') {
        delete extraFormData.id;
      }
      // if (formData.password === oldPassword) {
      //   delete extraFormData.password;
      // }
      const resp =
        provider === DefaultAccessType
          ? await service.saveGB(extraFormData)
          : await service.saveFixed(extraFormData);
      if (resp.status === 200) {
        form.resetFields();
        onlyMessage('操作成功');
        history.back();
      } else {
        onlyMessage('操作失败', 'error');
      }
    }
  }, [oldPassword]);

  // const intlFormat = (
  //   id: string,
  //   defaultMessage: string,
  //   paramsID?: string,
  //   paramsMessage?: string,
  // ) => {
  //   const paramsObj: Record<string, string> = {};
  //   if (paramsID) {
  //     const paramsMsg = intl.formatMessage({
  //       id: paramsID,
  //       defaultMessage: paramsMessage,
  //     });
  //     paramsObj.name = paramsMsg;
  //   }

  //   return intl.formatMessage(
  //     {
  //       id,
  //       defaultMessage,
  //     },
  //     paramsObj,
  //   );
  // };

  return (
    <>
      <PageContainer>
        <Card className="mediaDevice" style={{ minHeight }}>
          <Row gutter={24}>
            <Col span={12}>
              <Form
                form={form}
                layout={'vertical'}
                onFinish={() => {
                  handleSave();
                }}
                labelCol={{
                  style: { width: 100 },
                }}
              >
                <Row>
                  <Col span={24}>
                    <Form.Item
                      name={'provider'}
                      label={'接入方式'}
                      required
                      rules={[{ required: true, message: '请选择接入方式' }]}
                    >
                      <RadioCard
                        model={'singular'}
                        itemStyle={{ width: '50%' }}
                        onSelect={(key) => {
                          console.log(key);
                          setAccessType(key);
                          queryProduct(key);
                          form.resetFields(['id']);
                        }}
                        disabled={id}
                        options={[
                          {
                            label: 'GB/T28181',
                            value: DefaultAccessType,
                          },
                          {
                            label: '固定地址',
                            value: 'fixed-media',
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Form.Item name={'photoUrl'}>
                      <UploadImage />
                    </Form.Item>
                  </Col>
                  <Col span={16}>
                    {accessType === DefaultAccessType ? (
                      <Form.Item
                        label={'ID'}
                        name={'id'}
                        rules={[
                          { required: true, message: '请输入ID' },
                          {
                            pattern: /^[a-zA-Z0-9_\-]+$/,
                            message: intl.formatMessage({
                              id: 'pages.form.tip.id',
                              defaultMessage: '请输入英文或者数字或者-或者_',
                            }),
                          },
                          {
                            max: 64,
                            message: intl.formatMessage({
                              id: 'pages.form.tip.max64',
                              defaultMessage: '最多输入64个字符',
                            }),
                          },
                        ]}
                      >
                        <Input placeholder={'请输入ID'} disabled={!!id} />
                      </Form.Item>
                    ) : (
                      <Form.Item
                        label={'ID'}
                        name={'id'}
                        rules={[
                          {
                            pattern: /^[a-zA-Z0-9_\-]+$/,
                            message: intl.formatMessage({
                              id: 'pages.form.tip.id',
                              defaultMessage: '请输入英文或者数字或者-或者_',
                            }),
                          },
                          {
                            max: 64,
                            message: intl.formatMessage({
                              id: 'pages.form.tip.max64',
                              defaultMessage: '最多输入64个字符',
                            }),
                          },
                        ]}
                      >
                        <Input placeholder={'请输入ID'} disabled={!!id} />
                      </Form.Item>
                    )}

                    <Form.Item
                      label={'设备名称'}
                      name={'name'}
                      required
                      rules={[
                        { required: true, message: '请输入名称' },
                        { max: 64, message: '最多可输入64个字符' },
                      ]}
                    >
                      <Input placeholder={'请输入设备名称'} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label={'所属产品'}
                      required
                      rules={[{ required: true, message: '请选择所属产品' }]}
                    >
                      <Form.Item name={'productId'} noStyle>
                        <Select
                          showSearch
                          allowClear
                          fieldNames={{
                            label: 'name',
                            value: 'id',
                          }}
                          disabled={!!id}
                          options={productList}
                          placeholder={'请选择所属产品'}
                          style={{ width: id ? '100%' : 'calc(100% - 36px)' }}
                          filterOption={(input, option) =>
                            (option!.name as unknown as string)
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          onSelect={(_: any, node: any) => {
                            const pwd = node.configuration ? node.configuration.access_pwd : '';
                            form.setFieldsValue({
                              password: pwd,
                            });
                          }}
                        />
                      </Form.Item>
                      {!id && (
                        <Form.Item noStyle>
                          {getButtonPermission('device/Product', 'add') ? (
                            <Tooltip title={'暂无权限，请联系管理员'}>
                              <Button type={'link'} style={{ padding: '4px 10px' }} disabled>
                                <PlusOutlined />
                              </Button>
                            </Tooltip>
                          ) : (
                            <Button
                              type={'link'}
                              style={{ padding: '4px 10px' }}
                              onClick={() => {
                                setProductVisible(true);
                              }}
                            >
                              <PlusOutlined />
                            </Button>
                          )}
                        </Form.Item>
                      )}
                    </Form.Item>
                  </Col>
                  {accessType === DefaultAccessType && (
                    <Col span={24}>
                      <Form.Item
                        label={'接入密码'}
                        name={'password'}
                        required
                        rules={[
                          { required: true, message: '请输入接入密码' },
                          { max: 64, message: '最大可输入64位' },
                        ]}
                      >
                        <Input.Password placeholder={'请输入接入密码'} />
                      </Form.Item>
                    </Col>
                  )}
                  {id && (
                    <>
                      <Col span={24}>
                        <Form.Item
                          label={'流传输模式'}
                          name={'streamMode'}
                          required
                          rules={[{ required: true, message: '请选择流传输模式' }]}
                        >
                          <Radio.Group
                            optionType="button"
                            buttonStyle="solid"
                            options={[
                              { label: 'UDP', value: 'UDP' },
                              { label: 'TCP被动', value: 'TCP_PASSIVE' },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={'设备厂商'}
                          name={'manufacturer'}
                          rules={[{ max: 64, message: '最多可输入64个字符' }]}
                        >
                          <Input placeholder={'请输入设备厂商'} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={'设备型号'}
                          name={'model'}
                          rules={[{ max: 64, message: '最多可输入64个字符' }]}
                        >
                          <Input placeholder={'请输入设备型号'} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={'固件版本'}
                          name={'firmware'}
                          rules={[{ max: 64, message: '最多可输入64个字符' }]}
                        >
                          <Input placeholder={'请输入固件版本'} />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                  <Col span={24}>
                    <Form.Item label={'说明'} name={'description'}>
                      <Input.TextArea
                        // placeholder={intlFormat(
                        //   'pages.form.tip.input.props',
                        //   '请输入',
                        //   'pages.table.describe',
                        //   '说明',
                        // )}
                        placeholder="请输入说明"
                        rows={4}
                        style={{ width: '100%' }}
                        maxLength={200}
                        showCount={true}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name={'id'} hidden>
                  <Input />
                </Form.Item>
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      保存
                    </Button>
                  </Form.Item>
                </Col>
              </Form>
            </Col>
            <Col span={12}>
              {accessType === DefaultAccessType ? (
                <div className={styles.doc} style={{ height: 800 }}>
                  <h1>1.概述</h1>
                  <div>
                    视频设备通过GB/T28181接入平台整体分为2部分，包括平台端配置和设备端配置，不同的设备端配置的路径或页面存在差异，但配置项基本大同小异。
                  </div>
                  <h1>2.配置说明</h1>
                  <h1>平台端配置</h1>
                  <h2>1、ID</h2>
                  <div>设备唯一标识，请填写设备端配置的设备编号。</div>
                  <h2>2、所属产品</h2>
                  <div>
                    只能选择接入方式为GB/T28281的产品，若当前无对应产品，可点击右侧快速添加按钮，填写产品名称和选择GB/T28181类型的网关完成产品创建
                  </div>
                  <h2>3、接入密码</h2>
                  <div>
                    配置接入密码，设备端配置的密码需与该密码一致。该字段可在产品-设备接入页面进行统一配置，配置后所有设备将继承产品配置。设备单独修改后将脱离继承关系。
                  </div>
                  <h1>设备端配置</h1>
                  <div>
                    各个厂家、不同设备型号的设备端配置页面布局存在差异，但配置项基本大同小异，此处以大华摄像头为例作为接入配置示例
                  </div>
                  <div className={styles.image}>
                    <Image width="100%" src={img1} />
                  </div>
                  <h2>1、SIP服务器编号/SIP域</h2>
                  <div>
                    SIP服务器编号填入该设备所属产品-接入方式页面“连接信息”的SIP。
                    SIP域通常为SIP服务器编号的前10位。
                  </div>
                  <div className={styles.image}>
                    <Image width="100%" src={img2} />
                  </div>
                  <h2>2、SIP服务器IP/端口</h2>
                  <div>SIP服务器IP/端口填入该设备所属产品-接入方式页面中“连接信息”的IP/端口。</div>
                  <div className={styles.image}>
                    <Image width="100%" src={img3} />
                  </div>
                  <h2>3、设备编号</h2>
                  <div>
                    设备编号为设备唯一性标识，物联网平台的设备接入没有校验该字段，输入任意数字均不影响设备接入平台。
                  </div>
                  <h2>4、注册密码</h2>
                  <div>填入该设备所属产品-接入方式页面中“GB28281配置”处的接入密码</div>
                  <div className={styles.image}>
                    <Image width="100%" src={img4} />
                  </div>
                  <h2>5、其他字段</h2>
                  <div>不影响设备接入平台，可保持设备初始化值。</div>
                </div>
              ) : (
                <div className={styles.doc} style={{ height: 600 }}>
                  <h1>1.概述</h1>
                  <div>视频设备通过RTSP、RTMP固定地址接入平台分为2步。</div>
                  <div>1、添加视频设备</div>
                  <div>2、添加视频下的通道地址。</div>
                  <div>注：当前页面为新增视频设备，新增完成后点击设备的“通道”按钮，添加通道。</div>
                  <h1>2.配置说明</h1>
                  <h2>1、ID</h2>
                  <div>设备唯一标识，若不填写，系统将自动生成唯一标识。</div>
                  <h2>2、所属产品</h2>
                  <div>
                    只能选择接入方式为固定地址的产品，若当前无对应产品，可点击右侧快速添加按钮，填写产品名称和选择固定地址类型的网关完成产品创建。
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Card>
        <SaveProductModal
          visible={productVisible}
          type={accessType}
          close={() => {
            setProductVisible(false);
          }}
          reload={(productId: string, name: string) => {
            form.setFieldsValue({ productId });
            productList.push({
              id: productId,
              name,
            });
            setProductList([...productList]);
          }}
        />
      </PageContainer>
    </>
  );
};
export default Save;
