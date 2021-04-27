import React, { useEffect, useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { Icon, Input, message, Modal, Select, Spin, Tooltip } from 'antd';
import { ConnectState } from '@/models/connect';
import { connect } from 'dva';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps {
    close: Function;
    data: any;
    save: Function;
    opcId: string;
}

interface State {
    productList: any[];
    clusterList: any[];
}

const BindSave: React.FC<Props> = props => {
    const initState: State = {
        productList: [],
        clusterList: [],
    };
    const [productList, setProductList] = useState(initState.productList);
    // 消息协议
    const [clusterList, setClusterList] = useState(initState.clusterList);
    const [loading, setLoading] = useState<boolean>(true);
    const {
        form: { getFieldDecorator },
        form,
    } = props;
    const submitData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;

            const product: any =
                productList.find(i => i.id === fileValue.productId) || {};

            preservation({
                ...fileValue,
                productName: product.name
            });
        });
    };

    const preservation = (item: any) => {
        if (props.data.id) {
            apis.deviceInstance.saveOrUpdate(item)
                .then((response: any) => {
                    if (response.status === 200) {
                        message.success('保存成功');
                        props.save();
                    }
                })
                .catch(() => {
                });
        } else {
            let params = {
                productId: item.productId,
                productName: item.productName,
                deviceId: item.id,
                deviceName: item.name,
                opcUaId: props.opcId,
                serverId: item.serverId
            }
            apis.opcUa.saveDevice(params)
                .then((response: any) => {
                    if (response.status === 200) {
                        message.success('创建成功');
                        props.save();
                    }
                })
                .catch(() => {
                });
        }
    };

    const queryClusterList = () => {
        apis.opcUa.clusterList().then(res => {
            if (res.status === 200) {
                setClusterList(res.result);
            }
        })
    };

    useEffect(() => {
        queryClusterList();
        // 获取下拉框数据
        apis.deviceProdcut
            .queryNoPagin(encodeQueryParam({
                paging: false,
                terms: {
                    messageProtocol: 'opc-ua'
                }
            }))
            .then((response: any) => {
                if (response.status === 200) {
                    setLoading(false);
                    setProductList(response.result);
                }
            })
            .catch(() => {
            });
    }, []);

    return (
        <Modal
            title={`${props.data.id ? '编辑' : '新建'}设备`}
            visible
            width={600}
            okText="确定"
            cancelText="取消"
            onOk={() => {
                submitData();
            }}
            onCancel={() => props.close()}
        >
            <Spin spinning={loading}>
                <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                    {!props.data.id && <Form.Item key="id" label="设备id">
                        {getFieldDecorator('id', {
                            rules: [
                                { required: true, message: '请输入设备id' },
                                { max: 64, message: '设备ID不超过64个字符' },
                                { pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, "g"), message: '产品ID只能由数字、字母、下划线、中划线组成' }
                            ],
                            initialValue: props.data.id,
                        })(<Input placeholder="请输入设备id" disabled={!!props.data.id} />)}
                    </Form.Item>}
                    <Form.Item key="name" label="设备名称">
                        {getFieldDecorator('name', {
                            rules: [
                                { required: true, message: '请输入设备名称' },
                                { max: 200, message: '设备名称不超过200个字符' }
                            ],
                            initialValue: props.data.name,
                        })(<Input placeholder="请输入设备名称" />)}
                    </Form.Item>
                    <Form.Item key="productId" label="产品">
                        {getFieldDecorator('productId', {
                            rules: [{ required: true }],
                            initialValue: props.data.productId,
                        })(
                            <Select
                                placeholder="请选择产品" disabled={!!props.data.id}>
                                {(productList || []).map(item => (
                                    <Select.Option
                                        key={JSON.stringify({ productId: item.id, productName: item.name })}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>,
                        )}
                    </Form.Item>
                    <Form.Item key="serverId" label={(
                        <span>
                            集群节点&nbsp;
                            <Tooltip title="在指定的集群节点中拉取此设备的数据">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    )}>
                        {getFieldDecorator('serverId', {
                            initialValue: props.data.serverId,
                        })(
                            <Select placeholder="请选择">
                                {(clusterList || []).map(item => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.id}
                                    </Select.Option>
                                ))}
                            </Select>,
                        )}
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default connect(({ deviceProduct, loading }: ConnectState) => ({
    deviceProduct,
    loading,
}))(Form.create<Props>()(BindSave));