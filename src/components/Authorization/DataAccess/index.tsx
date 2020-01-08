import React, { useState } from "react"
import { Drawer, Tabs, Table, Checkbox, Button, Form, message } from "antd"
import styles from '../index.less';
import { FormComponentProps } from "antd/lib/form";

interface Props extends FormComponentProps {
    close: Function,
    save: Function,
    checkPermission: any;
}
interface State {
    checkPermission: any;
}

const DataAccess: React.FC<Props> = (props) => {

    const [checkPermission, setCheckPermission] = useState(props.checkPermission);

    const { form: { getFieldDecorator }, form } = props;

    return (
        <Drawer
            visible
            title="数据权限配置"
            onClose={() => { props.close() }}
            width={'30VW'}
        >
            <div id="permission-drawer">

                <Tabs defaultActiveKey="field">
                    <Tabs.TabPane tab="字段权限" key="field">
                        <Table
                            rowKey={'name'}
                            columns={[
                                {
                                    dataIndex: 'name',
                                    title: '字段名称',
                                },
                                {
                                    title: '操作',
                                    render: (record) =>
                                        <div className={styles.permissionForm}>
                                            <Form.Item >
                                                {getFieldDecorator(`fieldAccess.${record.name}`, {

                                                })(
                                                    <Checkbox.Group
                                                        options={
                                                            (checkPermission.actions || [])
                                                                .filter((item: any) =>
                                                                    ((item.properties || {}).supportDataAccess || '').indexOf('DENY_FIELDS') > -1)
                                                                .map((e: { action: string, name: string }) => { return { 'label': e.name, 'value': e.action } })
                                                        } />
                                                )}
                                            </Form.Item>
                                        </div>
                                }
                            ]}
                            dataSource={checkPermission.optionalFields}
                        />

                    </Tabs.TabPane>
                    <Tabs.TabPane tab="数据权限" key="data">
                        <Table
                            rowKey='name'
                            columns={[
                                {
                                    dataIndex: 'name',
                                    title: '名称'
                                }, {
                                    title: '操作',
                                    render: (record) =>
                                        <div className={styles.permissionForm}>
                                            <Form.Item>
                                                {getFieldDecorator(`dataAccess.org`, {

                                                })(
                                                    <Checkbox.Group
                                                        options={
                                                            (checkPermission.actions || [])
                                                                .filter((item: any) =>
                                                                    ((item.properties || {}).supportDataAccess || '').indexOf('org') > -1)
                                                                .map((e: { action: string, name: string }) => { return { 'label': e.name, 'value': e.action } })
                                                        }
                                                    />
                                                )}

                                            </Form.Item>
                                        </div>

                                }
                            ]}
                            dataSource={
                                checkPermission.properties.supportDataAccessTypes.some((e: string) => e === 'org') ? [
                                    { name: '仅限所在组织架构数据' }
                                ] : []
                            }
                        />
                    </Tabs.TabPane>
                </Tabs>
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e9e9e9',
                        padding: '10px 16px',
                        background: '#fff',
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={() => { props.close() }} style={{ marginRight: 8 }}>
                        关闭
               </Button>
                    <Button onClick={() => { console.log(message.config); message.success('保存成功'); props.save(form.getFieldsValue()) }} type="primary">
                        保存
               </Button>
                </div>
            </div>
        </Drawer>

    )
}
export default Form.create<Props>()(DataAccess);