import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import { FormComponentProps } from "antd/lib/form";
import apis from "@/services";
import { DimensionType, DimensionsItem } from "../data";

interface Props extends FormComponentProps {
    close: Function;
    data: Partial<DimensionsItem>;
    type: Partial<DimensionType>;
    save: Function;
}
interface State {
    typeList: DimensionType[];
    currentItem: Partial<DimensionsItem>;
    currentType: Partial<DimensionType>;
}

const Save: React.FC<Props> = (props) => {
    const { form: { getFieldDecorator }, form } = props;
    const initState: State = {
        typeList: [],
        currentItem: props.data,
        currentType: props.type,
    }
    const [typeList, setTypeList] = useState(initState.typeList);
    const [currentItem, setCurrentItem] = useState(initState.currentItem);
    const [currentType, setCurrentType] = useState(initState.currentType);

    useEffect(() => {
        apis.dimensions.typeList().then(e => {
            if (e.status === 200) {
                setTypeList(e.result);
            }
        }).catch(() => {

        });
    }, []);

    const save = () => {

        const id = currentItem.id;
        form.validateFields((err, fileValue) => {
            if (err) return;
            props.save({ id, ...fileValue });
        });
    }

    const renderTypeOption = () => {
        return (
            <Select placeholder="请选择类型">
                {
                    typeList.map(e => <Select.Option value={e.id} key={e.id}>{e.name}</Select.Option>)
                }
            </Select>
        )
    }

    let title = currentItem.id != undefined ? '编辑' : '新建';
    return (
        <Modal
            title={`${title}维度`}
            visible
            onCancel={() => props.close()}
            onOk={() => save()}
        >
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>

                <Form.Item
                    key="typeId"
                    label="类型"
                >
                    {getFieldDecorator('typeId', {
                        rules: [{
                            required: true,

                        }],
                        initialValue: currentType.id,
                    })(
                        renderTypeOption()
                    )}
                </Form.Item>
                <Form.Item
                    key="name"
                    label="名称"
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true }],
                        initialValue: currentItem.name,
                    })(<Input placeholder="请输入名称" />)}
                </Form.Item>
                <Form.Item
                    key="describe"
                    label="描述"
                >
                    {getFieldDecorator('describe', {
                        initialValue: currentItem.describe,
                    })(<Input.TextArea rows={3} />)}
                </Form.Item>

            </Form>
        </Modal>
    );
}
export default Form.create<Props>()(Save);