import { flattenArray } from '@/utils/util';
import _ from 'lodash';
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
  const [oldDataSource, setOldDataSource] = useState<any>({
    id: 'menu-permission',
    buttons: [],
    name: '菜单权限',
    children: [],
  });
  const [assetsList, setAssetsList] = useState<any[]>([]);

  const getDataList: any = (data1: any[]) => {
    if (Array.isArray(data1) && data1.length > 0) {
      return data1.map((item) => {
        const children = getDataList(item.children || []) || [];
        let check: number = 3;
        const blen = item.buttons?.length || 0;
        const bblen = (item?.buttons || []).filter((i: any) => i.granted).length || 0;
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

  const deRepeat = (arr: any[]) => {
    const list = new Map();
    arr.forEach((item) => {
      list.set(item.supportId, item);
    });
    return [...list.values()];
  };

  useEffect(() => {
    if (props?.value) {
      const list =
        flattenArray(props.value.children).filter(
          (item: any) =>
            item?.accessSupport?.value !== 'unsupported' &&
            item?.assetAccesses &&
            item?.assetAccesses?.length > 0,
        ) || [];
      setAssetsList(deRepeat(_.flatten(_.map(list, 'assetAccesses') || []) || []) || []);
      if (!props.value?.check) {
        // // 1: 全选 2: 只选了部分 3: 一个都没选
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

  const getAccessData: any = (arr: any[], str: string) => {
    if (Array.isArray(arr) && arr.length > 0) {
      return arr.map((item) => {
        let li: any[] = [];
        if (item?.assetAccesses.length > 0) {
          if (_.map(item.assetAccesses, 'supportId').includes(str)) {
            li = item.assetAccesses.map((i: any) => {
              return {
                ...i,
                granted: i.supportId === str,
              };
            });
          } else {
            li = item.assetAccesses;
          }
        }
        return {
          ...item,
          assetAccesses: li,
          children: item?.children ? getAccessData(item.children, str) : [],
        };
      });
    }
    return [];
  };

  return (
    <div style={{ border: '1px solid #f0f0f0', paddingBottom: 10 }}>
      <div style={{ overflowY: 'scroll', maxHeight: '500px' }}>
        <MenuPermission
          key={'menu-permission'}
          value={dataSource}
          level={1}
          assetsList={assetsList}
          checkChange={(data: any) => {
            if (data) {
              const dt = {
                ...dataSource,
                children: getAccessData(dataSource.children || [], data),
              };
              setDataSource(dt);
              if (props.onChange) {
                props.onChange(dt);
              }
            } else {
              setDataSource(oldDataSource);
              if (props.onChange) {
                props.onChange(oldDataSource);
              }
            }
          }}
          change={(data: any) => {
            setDataSource(data);
            if (props.onChange) {
              setOldDataSource(data);
              props.onChange(data);
            }
          }}
        />
      </div>
    </div>
  );
};
export default Allocate;
