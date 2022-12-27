import { Descriptions, Tooltip } from 'antd';
import { InstanceModel, service } from '@/pages/device/Instance';
import { useEffect, useState } from 'react';
import { useParams } from 'umi';
import { EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Edit from './Edit';
import { Ellipsis, PermissionButton } from '@/components';
import _ from 'lodash';

const Reation = () => {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const { permission } = PermissionButton.usePermission('device/Instance');

  const id = InstanceModel.detail?.id || params?.id;

  const getDetail = () => {
    service.detail(id || '').then((resp) => {
      if (resp.status === 200) {
        InstanceModel.detail = { id, ...resp.result };
      }
    });
  };

  useEffect(() => {
    if (id) {
      const item = InstanceModel.detail?.relations?.reverse();
      setData(item || []);
      // console.log(InstanceModel.detail?.relations?.reverse() )
    }
  }, [InstanceModel.detail?.relations]);

  return (
    <div style={{ width: '100%', marginTop: '20px' }}>
      <Descriptions
        style={{ marginBottom: 20 }}
        bordered
        column={3}
        size="small"
        labelStyle={{ width: 150 }}
        contentStyle={{ minWidth: 100 }}
        title={
          <span>
            关系信息
            <PermissionButton
              isPermission={permission.update}
              type="link"
              onClick={async () => {
                setVisible(true);
              }}
            >
              <EditOutlined />
              编辑
              <Tooltip title={`管理设备与其他业务的关联关系，关系来源于关系配置`}>
                <QuestionCircleOutlined />
              </Tooltip>
            </PermissionButton>
          </span>
        }
      >
        {(data || [])?.map((item: any) => (
          <Descriptions.Item span={1} label={item.relationName} key={item.objectId}>
            <Ellipsis
              title={item?.related ? _.map(item?.related || [], 'name').join(',') : ''}
              tooltip={{ placement: 'topLeft' }}
              style={{ maxWidth: 250 }}
              limitWidth={250}
            />
            {/* <Tooltip
              title={item?.related ? _.map(item?.related || [], 'name').join(',') : ''}
              placement="topLeft"
            >
              <div className="ellipsis" style={{ width: 300 }}>
                {item?.related ? _.map(item?.related || [], 'name').join(',') : ''}
              </div>
            </Tooltip> */}
          </Descriptions.Item>
        ))}
      </Descriptions>
      {visible && (
        <Edit
          data={data || []}
          close={() => {
            setVisible(false);
          }}
          reload={getDetail}
        />
      )}
    </div>
  );
};

export default Reation;
