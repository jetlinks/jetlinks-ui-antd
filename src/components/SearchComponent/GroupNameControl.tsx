import { ArrayItems } from '@formily/antd';
import { Select } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';

const GroupNameControl = (props: { name: string }) => {
  const intl = useIntl();
  const index = ArrayItems.useIndex!();
  return (
    <>
      {index === 0 ? (
        <div style={{ textAlign: 'center', fontWeight: 600 }}>
          {props?.name ||
            intl.formatMessage({
              id: 'component.search.label.firstGroup',
              defaultMessage: '第一组',
            })}
        </div>
      ) : (
        <Select
          options={[
            {
              label: intl.formatMessage({
                id: 'component.search.selection.and',
                defaultMessage: '并且',
              }),
              value: 'and',
            },
            {
              label: intl.formatMessage({
                id: 'component.search.selection.or',
                defaultMessage: '或者',
              }),
              value: 'or',
            },
          ]}
        />
      )}
    </>
  );
};
export default GroupNameControl;
