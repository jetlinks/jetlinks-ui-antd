import {PageContainer} from '@ant-design/pro-layout';
import {useDomFullHeight} from '@/hooks';
import {
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import Tree from './tree';
import './index.less';
import {Button, Tooltip} from 'antd';
import BaseTreeData from './baseMenu';
import { useEffect, useState} from 'react';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndProvider} from 'react-dnd';
import {cloneDeep} from 'lodash'
import { observable } from '@formily/reactive';
import { Observer, observer } from '@formily/react'
import { service } from '../index'
import type {TreeProps, DataNode} from 'antd/es/tree'

type MenuSettingModelType = {
  menuData: any[]
  notDragKeys: (string | number)[]
}

export const MenuSettingModel = observable<MenuSettingModelType>({
  menuData: [],
  notDragKeys: []
})

export default observer(() => {
  const {minHeight} = useDomFullHeight(`.menu-setting-warp`);
  const [baseMenu, setBaseMenu] = useState<any[]>(BaseTreeData);
  const [loading, setLoading] = useState(false)

  const finedObject = (data: any[], code: string | number, callback: (index: number, arr: any[], item: any) => void) => {

    data.forEach((item, index) => {
      if (item.code === code) {
        return callback(index, data, item)
      }

      if (item.children) {
        finedObject(item.children, code, callback);
      }
    });
  };

  const onTreeDrop: TreeProps['onDrop'] = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const data = [...MenuSettingModel.menuData];
    let dragObj: DataNode & {parentId: string};

    finedObject(data, dragKey, (index, arr, item) => {
      arr.splice(index, 1);
      dragObj = item;
      dragObj.parentId = '';
    });

    if (!info.dropToGap) {
      finedObject(data, dropKey, (_i, _arr, item) => {
        item.children = item.children || [];
        dragObj.parentId = item.id
        
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && 
      (info.node as any).props.expanded && 
      dropPosition === 1 
    ) {
      finedObject(data, dropKey, (_i, _arr, item) => {
        item.children = item.children || [];
        dragObj.parentId = item.id 
      
        item.children.unshift(dragObj);
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      finedObject(data, dropKey, (index, arr, item) => {
        ar = arr;
        i = index;
        dragObj.parentId = item.parentId;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    MenuSettingModel.menuData = [...data]
  }

  const getKeys = (data: any[]): (string|number)[] => {
    return data.reduce((pre: (string|number)[] , next: any) => {
      const childrenKeys = next.children ? getKeys(next.children) : []
      return [...pre, next.code, ...childrenKeys]
    }, [])
  }

  const filterItem = (data: any[], dragKeys: (string | number)[]) => {
    return data.filter(item => {
      if (dragKeys.includes(item.code)) {
        return false
      } else if (item.children) {
        item.children = filterItem(item.children, dragKeys)
      }
      return true
    })
  }

  const onDrop = (item: any, dropIndex: string, type?: string) => {
      const newItem = cloneDeep(item);
      
      if (dropIndex) { // 切换层级或者挪动
        // const newMenus = cloneDeep(menuData);
        if (type === 'source') {
          finedObject(MenuSettingModel.menuData, dropIndex, (index, arr) => {
            arr.splice(index + 1, 0, newItem);
          });
          MenuSettingModel.menuData = [...MenuSettingModel.menuData];
        }
      } else { // 新增
        newItem.parentId = ''
        // 过滤掉内部已选择的节点
        if (newItem.children && MenuSettingModel.notDragKeys.length) {
          newItem.children = filterItem(newItem.children, MenuSettingModel.notDragKeys)
        }
        MenuSettingModel.menuData.push(newItem)
        MenuSettingModel.notDragKeys = getKeys(MenuSettingModel.menuData)
      }
    }

  const removeDragItem = (id: string | number) => {
    finedObject(MenuSettingModel.menuData, id, (index, arr) => {
      arr.splice(index, 1);
    });
    MenuSettingModel.menuData = [...MenuSettingModel.menuData]
    MenuSettingModel.notDragKeys = getKeys(MenuSettingModel.menuData)
  }

  const getSystemMenu = () => {
    service.queryMenuThree({ paging: false }).then(res => {
      if (res.status === 200) {
        MenuSettingModel.menuData = [...res.result]
        MenuSettingModel.notDragKeys = getKeys(res.result)
      }
    })
  }

  useEffect(() => {
    getSystemMenu()
    setBaseMenu(BaseTreeData);
  }, []);

  const updateMenu = () => {
    setLoading(true)
    service.updateMenus(MenuSettingModel.menuData).then(res => {
      setLoading(false)
      if (res.status === 200) {

      }
    })
  }

  return (
    <PageContainer>
      <div className={'menu-setting-warp'} style={{minHeight}}>
        <div className={'menu-setting-tip'}>
          <ExclamationCircleOutlined/>
          <span style={{paddingLeft: 12}}>
            基于系统源代码中的菜单数据，配置系统菜单。
          </span>
        </div>
        <div className={'menu-tree-content'}>
          <DndProvider backend={HTML5Backend}>
            <div className={'menu-tree left-tree'}>
              <div className={'menu-tree-title'} style={{padding: '10px 16px'}}>
                <div>
                  <span style={{paddingRight: 12}}>
                  源菜单
                  </span>
                  <Tooltip title={'根据系统代码自动读取的菜单数据'}>
                    <QuestionCircleOutlined/>
                  </Tooltip>
                </div>
                <Button type={'primary'} ghost onClick={() => {
                  MenuSettingModel.menuData = cloneDeep(baseMenu)
                }}>
                  一键拷贝
                </Button>
              </div>
              <Observer>
                {() => (
                  <Tree
                    onDrop={onDrop}
                    treeData={baseMenu}
                    droppableId={'source'}
                    notDragKeys={MenuSettingModel.notDragKeys}
                  />
                )}
              </Observer>
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div className={'menu-tree-drag-btn'}>
                请拖动至右侧
                <RightOutlined/>
              </div>
            </div>

            <div className={'menu-tree right-tree'}>
              <div className={'menu-tree-title'}>
                <div>
                  <span style={{paddingRight: 12}}>
                  系统菜单
                  </span>
                  <Tooltip title={'菜单管理页面配置的菜单数据'}>
                    <QuestionCircleOutlined/>
                  </Tooltip>
                </div>
              </div>
              <Observer>
                {() => (
                  <>
                  <Tree
                    onTreeDrop={onTreeDrop}
                    onDrop={onDrop}
                    treeData={MenuSettingModel.menuData}
                    droppableId={'menu'}
                    removeDragItem={removeDragItem}
                  />
                  </>
                )}
              </Observer>
            </div>
          </DndProvider>
        </div>
        <div>
          <Button type={'primary'} style={{ marginTop: 24 }} onClick={updateMenu} loading={loading}>
            保存
          </Button>
        </div>
      </div>
    </PageContainer>
  );
});
