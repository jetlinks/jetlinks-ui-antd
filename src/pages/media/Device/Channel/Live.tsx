// 通道直播
import { useState } from 'react';
import { Radio, Modal } from 'antd';
import { ScreenPlayer } from '@/components';

interface LiveProps {
  visible: boolean;
  url: string;
  onCancel: () => void;
}

const LiveFC = (props: LiveProps) => {
  const [] = useState();

  return (
    <Modal
      maskClosable={false}
      visible={props.visible}
      title={'播放'}
      width={800}
      onCancel={() => {
        if (props.onCancel) {
          props.onCancel();
        }
      }}
      onOk={() => {
        if (props.onCancel) {
          props.onCancel();
        }
      }}
    >
      <div>
        <ScreenPlayer showScreen={false} />
      </div>
      <div>
        <Radio.Group
          optionType={'button'}
          buttonStyle={'solid'}
          options={[
            { label: 'MP4', value: 'mp4' },
            { label: 'FLV', value: 'flv' },
            { label: 'HLS', value: 'hls' },
          ]}
        />
      </div>
    </Modal>
  );
};

export default LiveFC;
