import { PageContainer } from '@ant-design/pro-layout';
import { useDomFullHeight } from '@/hooks';
import {
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import Tree from './tree';
import './index.less';
import { Button, Tooltip } from 'antd';
import BaseTreeData from './baseMenu';
import { useEffect, useState } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

export default () => {
  const { minHeight } = useDomFullHeight(`.menu-setting-warp`);
  const [menuData] = useState<any[]>([]);
  const [baseMenu, setBaseMenu] = useState<any[]>([]);

  // const removeItem = (data: any[], id: string): any[] => {
  //   return data.filter(item => {
  //     if (item.id === id) {
  //       return false
  //     }
  //
  //     if (item.children) {
  //       item.children = removeItem(item.children, id)
  //     }
  //     return true
  //   })
  // }

  // const findItem = (data: any[], id: string) => {
  //   let object = null;
  //   data.some((item) => {
  //     if (item.id === id) {
  //       object = item;
  //       return true;
  //     }
  //
  //     if (item.children) {
  //       object = findItem(item.children, id);
  //       return !!object;
  //     }
  //
  //     return false;
  //   });
  //   return object;
  // };

  // const finedIndex = (data: any[], id: string): { index: number; menus: any[] } => {
  //   let object = {
  //     index: data.length,
  //     menus: data,
  //   };
  //   data.some((item, index) => {
  //     if (item.id === id) {
  //       object = {
  //         index,
  //         menus: data,
  //       };
  //       return true;
  //     }
  //
  //     if (item.children) {
  //       object = finedIndex(item.children, id);
  //       return !!object;
  //     }
  //
  //     return false;
  //   });
  //
  //   return object;
  // };

  // const onDragEnd = useCallback(
  //   (result: any) => {
  //     console.log(result);
  //     if (result.source.droppableId.includes('source')) {
  //       if (result.combine && result.combine.droppableId.includes('menu')) {
  //         const sourceIndex = result.source.index.replace(/(source|menu)&/, '');
  //         const draggableIdIndex = result.combine?.draggableId.replace(/(source|menu)&/, '');
  //         const sourceItem = findItem(baseMenu, sourceIndex);
  //         const newMenus = [...menuData];
  //         const { index, menus } = finedIndex(newMenus, draggableIdIndex);
  //         console.log(index, menus);
  //         menus.splice(index + 1, 0, sourceItem);
  //         console.log(newMenus);
  //         setMenuData([...newMenus]);
  //       } else if (result.destination && result.destination.droppableId.includes('menu')) {
  //         const sourceIndex = result.source.index.replace(/(source|menu)&/, '');
  //         const sourceItem = findItem(baseMenu, sourceIndex);
  //         const newMenus = [...menuData];
  //         if (sourceItem) {
  //           if (newMenus.length) {
  //             const destinationIndex = result.destination?.index.replace(/(source|menu)&/, '');
  //             // 获取右侧menu的位置
  //             const { index, menus } = finedIndex(newMenus, destinationIndex);
  //             console.log(index, menus);
  //             menus.splice(index + 1, 0, sourceItem);
  //           } else {
  //             newMenus.push(sourceItem);
  //           }
  //           console.log(newMenus);
  //           setMenuData([...newMenus]);
  //         }
  //       }
  //     }
  //   },
  //   [menuData, baseMenu],
  // );

  useEffect(() => {
    setBaseMenu(BaseTreeData);
  }, []);

  return (
    <PageContainer>
      <div className={'menu-setting-warp'} style={{ minHeight }}>
        <div className={'menu-setting-tip'}>
          <ExclamationCircleOutlined />
          基于系统源代码中的菜单数据，配置系统菜单。
        </div>
        <div className={'menu-tree-content'}>
          <DndProvider backend={HTML5Backend}>
            <div className={'menu-tree left-tree'}>
              <div className={'menu-tree-title'}>
                <div>
                  源菜单
                  <Tooltip title={'根据系统代码自动读取的菜单数据'}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                </div>
                <Button type={'primary'} ghost>
                  一键拷贝
                </Button>
              </div>
              <Tree treeData={baseMenu} droppableId={'source'} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className={'menu-tree-drag-btn'}>
                请拖动至右侧
                <RightOutlined />
              </div>
            </div>

            <div className={'menu-tree right-tree'}>
              <div className={'menu-tree-title'}>
                <div>
                  系统菜单
                  <Tooltip title={'菜单管理页面配置的菜单数据'}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                </div>
              </div>
              <Tree treeData={menuData} droppableId={'menu'} />
            </div>
          </DndProvider>
        </div>
        <div>
          <Button type={'primary'} style={{ marginTop: 24 }}>
            保存
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
