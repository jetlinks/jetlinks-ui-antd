// 通道直播
import { useCallback, useRef, useState } from 'react';
import { Radio, Modal } from 'antd';
import { ScreenPlayer } from '@/components';
import { service } from '../index';
import './index.less';

interface LiveProps {
  visible: boolean;
  deviceId: string;
  channelId: string;
  onCancel: () => void;
}

const LiveFC = (props: LiveProps) => {
  const [mediaType, setMediaType] = useState('mp4');
  const player = useRef<any>(null);

  const mediaStart = useCallback(
    async (type) => {
      const _url = service.ptzStart(props.deviceId, props.channelId, type);
      player.current?.replaceVideo(props.deviceId, props.channelId, _url);
    },
    [props.channelId, props.deviceId],
  );

  return (
    <Modal
      destroyOnClose
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
      <div className={'media-live'}>
        {props.visible && (
          <ScreenPlayer
            id={props.deviceId}
            channelId={props.channelId}
            ref={(ref) => {
              player.current = ref;
              mediaStart('mp4');
            }}
            showScreen={false}
            onMouseUp={(id, cId) => {
              service.ptzStop(id, cId);
            }}
            onMouseDown={(id, cId, type) => {
              service.ptzTool(id, cId, type);
            }}
          />
        )}
      </div>
      <div className={'media-live-tool'}>
        <Radio.Group
          optionType={'button'}
          buttonStyle={'solid'}
          value={mediaType}
          onChange={(e) => {
            setMediaType(e.target.value);
            mediaStart(e.target.value);
          }}
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
