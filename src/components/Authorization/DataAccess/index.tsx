import React from "react"
import { Drawer, Tabs, Table, Checkbox, Button, Form } from "antd"
import styles from '../index.less';
import { FormComponentProps } from "antd/lib/form";
import { subtract } from "@/utils/CollectionUtils";

interface Props extends FormComponentProps {
    close: Function,
    save: Function,
    checkPermission: any;
}
const DataAccess: React.FC<Props> = (props) => {

    const { checkPermission } = props;

    const { form: { getFieldDecorator }, form } = props;

    const dataAccesses = (checkPermission.autz || {}).dataAccesses || [];

    const saveDataAccess = () => {
        //组合数据，反向获取未勾选的数据
        const data = form.getFieldsValue();
        const tempFieldAccess = data.fieldAccess;
        const tempDataAccess = data.dataAccess;
        let permissionId = checkPermission.id;
        let fieldAccess: any[] = [];
        let dataAccess: any[] = [];
        for (const key in tempFieldAccess) {
            const tempAction = (checkPermission.actions).filter((item: any) =>
                ((item.properties || {}).supportDataAccess || '').indexOf('DENY_FIELDS') > -1)
                .map((e: { action: string, name: string }) => e.action);
            if (tempFieldAccess.hasOwnProperty(key)) {
                const element = tempFieldAccess[key];
                const action = subtract(tempAction, element);
                if (action.size > 0) {
                    fieldAccess.push({ name: key, action: [...action] });
                }
            }
        }
        for (const key in tempDataAccess) {
            // const tempAction = (checkPermission.actions || [])
            //     .filter((item: any) =>
            //         ((item.properties || {}).supportDataAccess || '').indexOf('org') > -1)
            //     .map((e: { action: string, name: string }) => e.action)
            if (tempDataAccess.hasOwnProperty(key)) {
                const element = tempDataAccess[key];
                // const action = subtract(tempAction, element);
                // if (action.size > 0) {
                dataAccess.push({ type: key, action: [...element] });
                // }
            }
        }
        props.save({ permissionId, fieldAccess, dataAccess });
    }

    return (
        <Drawer
            visible
            title="数据权限配置"
            onClose={() => { props.close() }}
            width={'30VW'}
        >
            <div id="permission-drawer">

                <Tabs defaultActiveKey="field">
                    <Tabs.TabPane tab="字段权限" key="field" forceRender={true}>
                        <Table
                            rowKey={'name'}
                            pagination={false}
                            style={{ height: '70vh', overflow: 'auto' }}
                            columns={[
                                {
                                    dataIndex: 'name',
                                    title: '字段名称',
                                },
                                {
                                    title: '操作',
                                    render: (record: any) => {

                                        //禁用的操作，(UI中取消勾选的操作)
                                        let tempItem = (dataAccesses as any[])
                                            .filter(item => item.type !== 'DENY-FIELDS')
                                            .filter(item => (item.config.fields || [])
                                                .some((e: string) => e === record.name))
                                            .map(i => i.action);

                                        //所有操作
                                        let tempInit = (checkPermission.actions).filter((item: any) =>
                                            ((item.properties || {}).supportDataAccess || '').indexOf('DENY_FIELDS') > -1)
                                            .map((e: { action: string, name: string }) => e.action);

                                        return (
                                            <div className={styles.permissionForm}>
                                                <Form.Item >
                                                    {getFieldDecorator(`fieldAccess.${record.name}`, {
                                                        initialValue: [...subtract(tempInit, tempItem)],
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
                                        )
                                    }
                                }
                            ]}
                            dataSource={checkPermission.optionalFields}
                        />

                    </Tabs.TabPane>
                    <Tabs.TabPane tab="数据权限" key="data" forceRender={true}>
                        <Table
                            rowKey='name'
                            columns={[
                                {
                                    dataIndex: 'name',
                                    title: '名称'
                                }, {
                                    title: '操作',
                                    render: (record) => {

                                        //禁用的操作，（UI中取消勾选的操作）
                                        let tempItem = (dataAccesses as any[])
                                            .filter(item => (item.config || {}).scopeType === 'org')
                                            .map(i => i.action);

                                        // let tempInit = (checkPermission.actions || [])
                                        //     .filter((item: any) =>
                                        //         ((item.properties || {}).supportDataAccess || '').indexOf('org') > -1)
                                        //     .map((e: { action: string, name: string }) => e.action)

                                        return (
                                            <div className={styles.permissionForm}>
                                                <Form.Item>
                                                    {getFieldDecorator(`dataAccess.org`, {
                                                        initialValue: tempItem
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
                                        )
                                    }

                                }
                            ]}
                            dataSource={
                                checkPermission.properties.supportDataAccessTypes.some((e: string) => e === 'org') ? [
                                    { name: '仅限所在机构的数据' }
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
                    <Button onClick={() => { saveDataAccess() }} type="primary">
                        确认
                    </Button>
                </div>
            </div>
        </Drawer>

    )
}
export default Form.create<Props>()(DataAccess);
