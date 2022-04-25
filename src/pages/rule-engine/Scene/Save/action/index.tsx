import ActionItem from './action';
import './index.less';
import { ProFormList } from '@ant-design/pro-form';

export default () => {
  return (
    <div className={'actions-items'}>
      <ProFormList
        name={'actions'}
        creatorButtonProps={{
          creatorButtonText: '新增',
        }}
      >
        {(meta, index, action) => {
          return (
            <ActionItem
              onRemove={() => {
                action.remove?.(index);
              }}
            />
          );
        }}
      </ProFormList>
    </div>
  );
};
