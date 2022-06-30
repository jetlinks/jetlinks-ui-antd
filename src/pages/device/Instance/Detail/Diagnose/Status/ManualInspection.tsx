import { Button, Descriptions, Modal } from 'antd';
import styles from './index.less';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'umi';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { InstanceModel } from '@/pages/device/Instance';
interface Props {
  close: () => void;
  data: any;
  save: (data: any) => void;
}

const ManualInspection = (props: Props) => {
  const { data } = props;

  const history = useHistory<Record<string, string>>();

  const okBtn = () => {
    props.save(data);
  };

  return (
    <Modal
      title="人工检查"
      onCancel={() => {
        props.close();
      }}
      width={900}
      footer={[
        <Button
          key="back"
          onClick={() => {
            if (data.type === 'device') {
              InstanceModel.active = 'detail';
            } else {
              history.push(
                `${getMenuPathByParams(MENUS_CODE['device/Product/Detail'], data.productId)}`,
                {
                  tab: 'access',
                },
              );
            }
            props.close();
          }}
        >
          去修改
        </Button>,
        <Button
          key="submit"
          onClick={() => {
            okBtn();
          }}
        >
          确认无误
        </Button>,
      ]}
      visible
    >
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <div className={styles.alert}>
            <InfoCircleOutlined style={{ marginRight: 10 }} />
            请检查配置项是否填写正确，若您确定该项无需诊断可
            <a
              onClick={() => {
                okBtn();
              }}
            >
              忽略
            </a>
          </div>
          <div style={{ marginTop: 10 }}>
            <Descriptions title={data?.data?.name} layout="vertical" bordered>
              {(data?.data?.properties || []).map((item: any) => (
                <Descriptions.Item
                  key={item.property}
                  label={`${item.name}${item?.description ? `(${item.description})` : ''}`}
                >
                  {data?.configuration[item.property] || ''}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </div>
        </div>
        {data?.data?.description ? (
          <div
            style={{ width: '50%', border: '1px solid #f0f0f0', padding: 10, borderLeft: 'none' }}
          >
            <h4>诊断项说明</h4>
            <p>{data?.data?.description}</p>
          </div>
        ) : (
          ''
        )}
      </div>
    </Modal>
  );
};

export default ManualInspection;
