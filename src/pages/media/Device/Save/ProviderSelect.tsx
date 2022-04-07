import classNames from 'classnames';

interface ProviderProps {
  value?: string;
  options?: any[];
  onChange?: (id: string) => void;
  onSelect?: (id: string, rowData: any) => void;
}

export default (props: ProviderProps) => {
  return (
    <div className={'provider-list'}>
      {props.options && props.options.length
        ? props.options.map((item) => (
            <div
              onClick={() => {
                if (props.onChange) {
                  props.onChange(item.id);
                }

                if (props.onSelect) {
                  props.onSelect(item.id, item);
                }
              }}
              style={{ padding: 16 }}
              className={classNames({ active: item.id === props.value })}
            >
              {item.name}
            </div>
          ))
        : null}
    </div>
  );
};
