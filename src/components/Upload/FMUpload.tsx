import { useIntl } from '@@/plugin-locale/localeExports';

const FMUpload = () => {
  const intl = useIntl();
  return (
    <div>
      {intl.formatMessage({
        id: 'component.upload',
        defaultMessage: '上传多个文件',
      })}
    </div>
  );
};
export default FMUpload;
