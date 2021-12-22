import { Badge, Col, Modal, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import { service, state } from '@/pages/device/Firmware';
import encodeQuery from '@/utils/encodeQuery';

interface Props {
  visible: boolean;
  close: () => void;
}

type TaskState = 'waiting' | 'processing' | 'success' | 'failed';
const map = {
  waiting: {
    status: 'warning',
    text: '等待升级',
  },
  processing: {
    status: 'processing',
    text: '升级中',
  },
  success: {
    status: 'success',
    text: '完成',
  },
  failed: {
    status: 'error',
    text: '失败',
  },
};
const Detail = (props: Props) => {
  const [count, setCount] = useState<{
    waiting: number;
    processing: number;
    success: number;
    failed: number;
  }>({
    waiting: 0,
    processing: 0,
    success: 0,
    failed: 0,
  });

  const getStateCount = (status: TaskState) =>
    service
      .historyCount(
        encodeQuery({
          terms: {
            taskId: state.taskItem?.id,
            state: status,
          },
        }),
      )
      .then((resp) => {
        setCount({ ...count, [`${status}`]: resp.result });
      });

  useEffect(() => {
    (['waiting', 'processing', 'success', 'failed'] as TaskState[]).forEach((s) => {
      getStateCount(s);
    });
  }, [state.taskItem]);

  return (
    <Modal width="30vw" visible={props.visible} onCancel={() => props.close()} title="任务详情">
      <Row gutter={16}>
        {
          // todo 数据展示错误
          Object.keys(count)
            .reduce((previousValue: any[], currentValue) => {
              previousValue.push({
                key: currentValue,
                value: count[currentValue],
                ...map[currentValue],
              });
              return previousValue;
            }, [])
            .map((item) => (
              <Col span={6}>
                <Statistic
                  title={<Badge status={item.status} text={item.text} />}
                  value={item.value}
                />
              </Col>
            ))
        }
      </Row>
    </Modal>
  );
};
export default Detail;
