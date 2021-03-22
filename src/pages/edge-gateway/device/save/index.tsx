import { Form, Input, message, Modal, Select, TreeSelect } from "antd";
import { FormComponentProps } from "antd/es/form";
import apis from '@/services';
import React, { useEffect, useState } from "react";
import encodeQueryParam from "@/utils/encodeParam";

interface Props extends FormComponentProps {
    data: any;
    close: Function;
    save: Function;
}
interface State {
    productList: any[];
    organizationList: any[];
}

const Save: React.FC<Props> = props => {
    const {
        form: { getFieldDecorator },
        form,
        data
    } = props;
    const initState: State = {
        productList: [],
        organizationList: [],
    };
    const [productList, setProductList] = useState(initState.productList);
    // 消息协议
    const [organizationList, setOrganizationList] = useState(initState.organizationList);

    useEffect(() => {
        // 获取下拉框数据
        apis.edgeProduct
            .queryNoPagin(encodeQueryParam({
                paging: false
            }))
            .then(response => {
                setProductList(response.result);
            })
            .catch(() => {
            });

        apis.deviceProdcut.queryOrganization()
            .then((res: any) => {
                if (res.status === 200) {
                    let orgList: any = [];
                    res.result.map((item: any) => {
                        orgList.push({ id: item.id, pId: item.parentId, value: item.id, title: item.name })
                    });
                    setOrganizationList(orgList);
                }
            }).catch(() => {
            });
    }, []);

    return (
        <Modal
            title={data.id ? `编辑` : '新增'}
            visible
            onCancel={() => { props.close() }}
            onOk={() => {
                form.validateFields((err, fileValue) => {
                    if (err) return;

                    const product =
                        productList.find(i => i.id === fileValue.productId) || {};
                    let param = {
                        ...fileValue,
                        productName: product.name,
                        // state: { text: "未激活", value: "notActive" },
                    }
                    if (data.id) {
                        apis.edgeDevice.update(param).then(res => {
                            if (res.status === 200) {
                                props.save();
                                message.success('更新成功');
                            }
                        })
                    } else {
                        apis.edgeDevice.save(param).then(res => {
                            if (res.status === 200) {
                                props.save();
                                message.success('新增成功');
                            }
                        })
                    }
                });
            }}
        >
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <Form.Item label="设备ID">
                    {getFieldDecorator('id', {
                        rules: [{ required: true }],
                        initialValue: data?.id,
                    })(
                        <Input readOnly={!!data.id} />
                    )}
                </Form.Item>
                <Form.Item label="设备名称">
                    {getFieldDecorator('name', {
                        rules: [{ required: true }],
                        initialValue: data?.name,
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item key="productId" label="产品">
                    {getFieldDecorator('productId', {
                        rules: [{ required: true }],
                        initialValue: data?.productId,
                    })(
                        <Select placeholder="请选择产品" disabled={!!props.data.id}>
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
                <Form.Item key="orgId" label="所属机构">
                    {getFieldDecorator('orgId', {
                        initialValue: data?.orgId,
                    })(
                        <TreeSelect
                            allowClear treeDataSimpleMode showSearch
                            placeholder="所属机构" treeData={organizationList}
                            treeNodeFilterProp='title' searchPlaceholder='根据机构名称模糊查询'
                        />
                    )}
                </Form.Item>
                <Form.Item key="describe" label="说明">
                    {getFieldDecorator('describe', {
                        initialValue: data?.describe,
                    })(<Input.TextArea rows={4} placeholder="请输入" />)}
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Form.create<Props>()(Save);