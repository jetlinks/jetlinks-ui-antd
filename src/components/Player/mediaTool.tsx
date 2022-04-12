import {
  CaretDownOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  CaretUpOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import './mediaTool.less';
import classNames from 'classnames';

interface MediaToolProps {
  onMouseUp?: (type: string) => void;
  onMouseDown?: (type: string) => void;
  className?: string;
}

export default (props: MediaToolProps) => {
  return (
    <div className={classNames('live-player-tools', props.className)}>
      <div className={'direction'}>
        <div
          className={'direction-item up'}
          onMouseDown={() => {
            if (props.onMouseDown) {
              props.onMouseDown('UP');
            }
          }}
          onMouseUp={() => {
            if (props.onMouseUp) {
              props.onMouseUp('UP');
            }
          }}
        >
          <CaretUpOutlined className={'direction-icon'} />
        </div>
        <div
          className={'direction-item right'}
          onMouseDown={() => {
            if (props.onMouseDown) {
              props.onMouseDown('RIGHT');
            }
          }}
          onMouseUp={() => {
            if (props.onMouseUp) {
              props.onMouseUp('RIGHT');
            }
          }}
        >
          <CaretRightOutlined className={'direction-icon'} />
        </div>
        <div
          className={'direction-item left'}
          onMouseDown={() => {
            if (props.onMouseDown) {
              props.onMouseDown('LEFT');
            }
          }}
          onMouseUp={() => {
            if (props.onMouseUp) {
              props.onMouseUp('LEFT');
            }
          }}
        >
          <CaretLeftOutlined className={'direction-icon'} />
        </div>
        <div
          className={'direction-item down'}
          onMouseDown={() => {
            if (props.onMouseDown) {
              props.onMouseDown('DOWN');
            }
          }}
          onMouseUp={() => {
            if (props.onMouseUp) {
              props.onMouseUp('DOWN');
            }
          }}
        >
          <CaretDownOutlined className={'direction-icon'} />
        </div>
        <div
          className={'direction-audio'}
          // onMouseDown={() => {
          //   const { id, channelId } = players[playerActive];
          //   if (props.onMouseDown && id && channelId) {
          //     props.onMouseDown(id, channelId, 'AUDIO');
          //   }
          // }}
          // onMouseUp={() => {
          //   const { id, channelId } = players[playerActive];
          //   if (props.onMouseUp && id && channelId) {
          //     props.onMouseUp(id, channelId, 'AUDIO');
          //   }
          // }}
        >
          {/*<AudioOutlined />*/}
        </div>
      </div>
      <div className={'zoom'}>
        <div
          className={'zoom-item zoom-in'}
          onMouseDown={() => {
            if (props.onMouseDown) {
              props.onMouseDown('ZOOM_IN');
            }
          }}
          onMouseUp={() => {
            if (props.onMouseUp) {
              props.onMouseUp('ZOOM_IN');
            }
          }}
        >
          <PlusOutlined />
        </div>
        <div
          className={'zoom-item zoom-out'}
          onMouseDown={() => {
            if (props.onMouseDown) {
              props.onMouseDown('ZOOM_OUT');
            }
          }}
          onMouseUp={() => {
            if (props.onMouseUp) {
              props.onMouseUp('ZOOM_OUT');
            }
          }}
        >
          <MinusOutlined />
        </div>
      </div>
    </div>
  );
};
