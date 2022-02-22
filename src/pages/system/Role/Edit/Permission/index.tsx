import { useEffect, useState } from 'react'
import { SettingOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Input, message, Select, Steps, Table, TableColumnsType } from 'antd';
import ChooseDepartment from './ChooseDepartment'
import Service from '@/pages/system/Role/service'
import styles from './index.less'
import _ from 'lodash';

const Permission = () => {
    const service = new Service('role')
    const [form] = Form.useForm();
    const [current, setCurrent] = useState<number>(0);
    const [visible, setVisible] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any[]>([])
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const [checkedPermission, setCheckedPermission] = useState<any>()

    useEffect(() => {
        service.queryMenuList({}).subscribe(resp => {
            if (resp.status === 200) {
                // setDataSource(resp.result)
                const data = [
                    {
                        "id": "1",
                        "parentId": "0",
                        "path": "",
                        "name": "test1",
                        "buttons": [],
                        children: [
                            {
                                "id": "11",
                                "parentId": "1",
                                "path": "",
                                "name": "test11",
                                "buttons": [
                                    {
                                        "id": "but11",
                                        "name": "but11",
                                        "options": {}
                                    },
                                    {
                                        "id": "but21",
                                        "name": "but21",
                                        "options": {}
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        "id": "2",
                        "parentId": "0",
                        "path": "",
                        "name": "test2",
                        "buttons": [
                            {
                                "id": "but6",
                                "name": "but6",
                                "options": {}
                            },
                            {
                                "id": "but8",
                                "name": "but8",
                                "options": {}
                            }
                        ],
                        children: []
                    }
                ]
                setDataSource(data)
            }
        })
    }, [])

    const menuColumns: TableColumnsType<any> = [
        {
            title: (
                <Checkbox
                    checked={checkAll}
                    onChange={(e) => {
                        setCheckAll(e.target.checked)
                        const tempForm = _.cloneDeep(form.getFieldsValue());
                        dataSource.forEach((item) => {
                            tempForm[item.id] = e.target.checked ? item.buttons.map((i) => i.id) : [];
                            tempForm[`_${item.id}`] = e.target.checked;
                        });
                        form.setFieldsValue(tempForm);
                    }}
                >菜单权限</Checkbox>
            ),
            width: 200,
            dataIndex: 'option',
            render: (text, record) => (
                <Form.Item name={`_${record.id}`} valuePropName="checked">
                    <Checkbox
                        onChange={(e) => {
                            form.setFieldsValue({
                                [record.id]: e.target.checked ? record.buttons.map((item: any) => `${item.id}`) : [],
                                [`_${record.id}`]: e.target.checked,
                            });
                        }}
                    >{record.name}</Checkbox>
                </Form.Item>
            ),
        },
        {
            title: "",
            dataIndex: 'buttons',
            render: (text: { name: string; id: string }[], record) => (
                <Form.Item name={record.id}>
                    <Checkbox.Group
                        name={record.id}
                        onChange={(data) => {
                            const list = Array.from(new Set<string>(data as string[]))
                            // const allButtons = _.map(_.flatten(_.map(dataSource, 'buttons')), 'id')
                            // setCheckAll(allButtons.length === list.length)
                            // console.log(form.getFieldsValue())
                            // console.log(allButtons)
                            setCheckedPermission(list)
                            form.setFieldsValue({
                                [`_${record.id}`]: text.length === data.length,
                            });
                        }}
                        options={text.map((item) => ({
                            label: item.name,
                            value: item.id,
                            key: item.id
                        }))}
                    />
                </Form.Item>
            ),
        }
    ];

    const dataColumns: TableColumnsType<PermissionItem> = [
        {
            title: '数据权限',
            dataIndex: 'actions',
            render: (text: { action: string; name: string; id: string }[], record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox style={{ width: '150px' }}>
                        {record.name}
                    </Checkbox>
                    <Select style={{ width: '200px' }}
                        showSearch
                        placeholder="请选择"
                        onChange={() => { }}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Select.Option value="jack">Jack</Select.Option>
                        <Select.Option value="lucy">Lucy</Select.Option>
                        <Select.Option value="tom">Tom</Select.Option>
                    </Select>
                    <div style={{ marginLeft: '15px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '100px' }}>特定部门：</div>
                        <Input addonAfter={<SettingOutlined onClick={() => {
                            setVisible(true)
                        }} />} defaultValue="mysite" />
                    </div>
                </div>
            )
        }
    ];

    return (
        <Card className={styles.rolePermission}>
            <Steps current={current}>
                <Steps.Step title="菜单权限" />
                <Steps.Step title="数据权限" />
            </Steps>
            <div style={{ marginTop: '15px' }}>
                {
                    current === 0 &&
                    <div>
                        <Input.Search enterButton placeholder="请输入权限名称" onSearch={() => { }} style={{ width: 300, marginBottom: '15px' }} />
                        <Form
                            onFinish={(data: unknown[]) => {
                                // const permissions = Object.keys(data)
                                //     .filter((i) => !i.startsWith('_'))
                                //     .map((item) => ({
                                //         id: item,
                                //         buttons: data[item],
                                //     }));
                                // console.log(_.flatten(_.map(permissions, 'buttons')).length)
                                // if (permissions.length === 0) {
                                //     message.error('请勾选菜单权限')
                                // } else {
                                    setCurrent(1)
                                // }

                            }}
                            form={form}
                            wrapperCol={{ span: 20 }}
                            labelCol={{ span: 3 }}
                        >
                            <Table
                                rowKey="id"
                                pagination={false}
                                columns={menuColumns}
                                dataSource={dataSource}
                            />
                        </Form>
                    </div>
                }
                {
                    current === 1 &&
                    <div>
                        <Input.Search enterButton placeholder="请输入权限名称" onSearch={() => { }} style={{ width: 300, marginBottom: '15px' }} />
                        <Table
                            rowKey="id"
                            pagination={false}
                            columns={dataColumns}
                            dataSource={dataSource}
                        />
                    </div>
                }
            </div>
            <div style={{ marginTop: '15px' }}>
                {current === 0 && (
                    <Button type="primary" onClick={form.submit}>
                        下一步
                    </Button>
                )}
                {current === 1 && (
                    <>
                        <Button style={{ margin: '0 8px' }} onClick={() => {
                            setCurrent(0)
                        }}>
                            上一步
                        </Button>
                        <Button type="primary" onClick={() => {

                        }}>
                            保存
                        </Button>
                    </>
                )}
            </div>
            <ChooseDepartment visible={visible} data={{}} cancel={() => {
                setVisible(false)
            }} />
        </Card>
    );
};
export default Permission;