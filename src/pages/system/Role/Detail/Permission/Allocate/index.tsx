import { useEffect, useState } from 'react';
import MenuPermission from './MenuPermission';

interface Props {
  onChange?: (data: any) => void;
  value?: any;
}

const Allocate = (props: Props) => {
  const [dataSource, setDataSource] = useState<any>({
    id: 'menu-permission',
    buttons: [],
    name: '菜单权限',
    children: [],
  });

  const getDataList: any = (data1: any[]) => {
    if (Array.isArray(data1) && data1.length > 0) {
      return data1.map((item) => {
        const children = getDataList(item.children || []) || [];
        let check: number = 3;
        const blen = item.buttons?.length || 0;
        const bblen = (item?.buttons || []).filter((i: any) => i.enabled).length || 0;
        const clen = children.length || 0;
        const cclen = (children || []).filter((i: any) => i.granted).length || 0;
        const cclen1 = (children || []).filter((i: any) => i.check === 1).length || 0;
        if (clen + blen > 0 && clen + blen === cclen1 + bblen) {
          check = 1;
        } else if (cclen + bblen === 0 && !item.granted) {
          check = 3;
        } else if (clen + blen === 0 && item.granted) {
          check = 1;
        } else {
          check = 2;
        }

        return {
          ...item,
          check,
          children,
        };
      });
    }
    return [];
  };

  useEffect(() => {
    if (props?.value) {
      if (!props.value?.check) {
        const children = getDataList(props.value?.children || []) || [];
        let check: number = 3;
        const clen = children.length || 0;
        const cclen = (children || []).filter((i: any) => i.granted).length || 0;
        const cclen1 = (children || []).filter((i: any) => i.check === 1).length || 0;
        if (clen > 0 && clen === cclen1) {
          check = 1;
        } else if (cclen === 0) {
          check = 3;
        } else {
          check = 2;
        }
        setDataSource({
          // 重新初始化
          id: 'menu-permission',
          buttons: [],
          check,
          name: '菜单权限',
          children,
        });
      } else {
        setDataSource(props.value);
      }
    }
  }, [props.value]);

  return (
    <div style={{ border: '1px solid #f0f0f0', paddingBottom: 10 }}>
      <div style={{ overflowY: 'scroll', maxHeight: '500px' }}>
        <MenuPermission
          key={'menu-permission'}
          value={dataSource}
          level={1}
          change={(data: any) => {
            setDataSource(data);
            if (props.onChange) {
              props.onChange(data);
            }
          }}
        />
      </div>
    </div>
  );
};
export default Allocate;
