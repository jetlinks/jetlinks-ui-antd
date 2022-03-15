import { useEffect, useState } from 'react';
import type { TableColumnsType } from 'antd';
import { Form } from 'antd';
import { Checkbox, Select, Table } from 'antd';
import Service from '@/pages/system/Role/service';
import _ from 'lodash';

interface Props {
  initialValues?: any;
  data: any;
  change: (data: any) => void;
}

const DataPermission = (props: Props) => {
  const service = new Service('role-permissions-data');
  const [form] = Form.useForm();
  const [typeList, setTypeList] = useState<any[]>([]);
  const [dimensionsList, setDimensionsList] = useState<any>({});

  const menuAssetsTypes = (data: any) => {
    service.queryAssetTypeList(data).subscribe((resp) => {
      if (resp.status === 200) {
        setTypeList(resp.result);
      }
    });
  };

  useEffect(() => {
    if (typeList.length > 0) {
      typeList.map((item) => {
        service.queryAssetsList(item.id).subscribe((resp) => {
          if (resp.status === 200) {
            dimensionsList[item.id] = resp.result;
            setDimensionsList({ ...dimensionsList });
          } else {
            dimensionsList[item.id] = undefined;
            setDimensionsList({ ...dimensionsList });
          }
        });
      });
    }
  }, [typeList]);

  useEffect(() => {
    if (Array.isArray(props.data) && props.data.length > 0) {
      menuAssetsTypes(props.data);
    }
  }, [props.data]);

  useEffect(() => {
    props.initialValues.map((item: { dimensions: any[]; assetType: string }) => {
      const type = _.map(item?.dimensions || [], 'dimensionType');
      form.setFieldsValue({
        [item.assetType]: {
          value: true,
          type,
        },
      });
    });
  }, [props.initialValues]);

  const dataColumns: TableColumnsType<PermissionItem> = [
    {
      title: '数据权限',
      dataIndex: 'name',
      render: (text: string, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Item name={[`${record.id}`, 'value']} valuePropName="checked">
            <Checkbox
              style={{ width: '150px' }}
              onChange={(e) => {
                form.setFieldsValue({
                  [`${record.id}`]: {
                    value: e.target.checked,
                    type: form.getFieldValue(`${record.id}`).type,
                  },
                });
                props.change(form.getFieldsValue());
              }}
            >
              {record.name}
            </Checkbox>
          </Form.Item>
          <Form.Item name={[record.id, 'type']}>
            <Select
              style={{ width: '300px' }}
              showSearch
              placeholder="请选择"
              mode="multiple"
              onChange={(value: string) => {
                form.setFieldsValue({
                  [`${record.id}`]: {
                    type: value,
                    value: form.getFieldValue(`${record.id}`).value,
                  },
                });
                props.change(form.getFieldsValue());
              }}
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {(dimensionsList[record.id] || []).map((item: { id: string; name: string }) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div>
        {/* <Input.Search enterButton placeholder="请输入权限名称" onSearch={() => { }} style={{ width: 300, marginBottom: '15px' }} /> */}
        <Form form={form} wrapperCol={{ span: 20 }} labelCol={{ span: 3 }}>
          <Table rowKey="id" pagination={false} columns={dataColumns} dataSource={typeList} />
        </Form>
      </div>
    </div>
  );
};
export default DataPermission;
