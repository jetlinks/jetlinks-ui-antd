import { TitleComponent } from '@/components';
import { randomString } from '@/utils/util';
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Badge, Descriptions, Modal, Tooltip } from 'antd';
import _ from 'lodash';
import styles from './index.less';

interface Props {
  close: () => void;
  data: any;
}

const DiagnosticAdvice = (props: Props) => {
  const { data } = props;
  return (
    <Modal
      title="设备诊断"
      onCancel={() => {
        props.close();
      }}
      onOk={() => {
        props.close();
      }}
      width={1000}
      visible
    >
      <div>
        <TitleComponent data="诊断建议" />
        <div className={styles.advice}>
          <div className={styles.alert}>
            <InfoCircleOutlined style={{ marginRight: 10 }} />
            所有诊断均无异常但设备仍未上线，请检查以下内容
          </div>
          <div style={{ marginLeft: 10 }}>
            {(data?.list || []).map((item: any) => (
              <div className={styles.infoItem} key={randomString()} style={{ margin: '10px 0' }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 15 }}>
        <TitleComponent data="连接信息" />
        <Descriptions column={2}>
          <Descriptions.Item span={1} label="设备ID">
            {data?.info?.id || ''}
          </Descriptions.Item>
          {data?.info?.address?.length > 0 && (
            <Descriptions.Item span={1} label="连接地址">
              <Tooltip
                placement="topLeft"
                title={
                  <div className="serverItem">
                    {(data?.info?.address || []).map((i: any) => (
                      <div key={i.address} className="ellipsis">
                        <Badge color={i.health === -1 ? 'red' : 'green'} />
                        {i.address}
                      </div>
                    ))}
                  </div>
                }
              >
                <div className="serverItem">
                  {(data?.info?.address || []).slice(0, 1).map((i: any) => (
                    <div key={i.address} className="ellipsis">
                      <Badge color={i.health === -1 ? 'red' : 'green'} />
                      {i.address}
                    </div>
                  ))}
                </div>
              </Tooltip>
            </Descriptions.Item>
          )}

          {(_.flatten(_.map(data?.info?.config, 'properties')) || []).map((item: any) => (
            <Descriptions.Item
              key={randomString()}
              span={1}
              label={
                item?.description ? (
                  <div>
                    <span style={{ marginRight: '10px' }}>{item.name}</span>
                    <Tooltip title={item.description}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                ) : (
                  item.name
                )
              }
            >
              {data?.info?.configValue[item?.property] || ''}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </div>
    </Modal>
  );
};

export default DiagnosticAdvice;
