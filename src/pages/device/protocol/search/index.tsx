import React from "react";
import Form, { FormComponentProps } from "antd/lib/form";
import { Input, Row, Col, Button } from "antd";

import styles from '../index.less';

interface Props extends FormComponentProps {
    search: Function;

}

const Search: React.FC<Props> = props => {

    const { form, form: { getFieldDecorator } } = props;

    const search = () => {
        const data = form.getFieldsValue();
        // TODO 查询数据
        props.search(data);
    }


    return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={18} key="name$LIKE">
                    <Form.Item label="协议名称">
                        {getFieldDecorator("name$LIKE")(<Input placeholder="请输入" />)}
                    </Form.Item>
                </Col>

                <div style={{ float: 'right', marginBottom: 24, marginRight: 15 }}>
                    <span className={styles.submitButtons}>
                        <Button type="primary" onClick={() => { search() }}>
                            查询
                            </Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => { form.resetFields(); props.search() }}>
                            重置
                        </Button>
                    </span>
                </div>
            </Row>
        </Form >
    )

}

export default Form.create<Props>()(Search);
