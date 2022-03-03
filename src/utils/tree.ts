/**
 场景
 树形数据过滤, 并保留原有树形结构不变, 即如果有子集被选中,父级同样保留。
 思路
 对数据进行处理，根据过滤标识对匹配的数据添加标识。如visible:true
 对有标识的子集的父级添加标识visible:true
 根据visible标识对数据进行递归过滤，得到最后的数据
 */

import _ from 'lodash';

export type TreeNode = {
  id: string;
  name: string;
  children: TreeNode[];
  visible?: boolean;
} & Record<string, any>;

/*
 *	对表格数据进行处理
 *	data 树形数据数组
 *	filter 过滤参数值
 *	filterType 过滤参数名
 */
export function treeFilter(data: TreeNode[], filter: string, filterType: string): TreeNode[] {
  const _data = _.cloneDeep(data);
  const traverse = (item: TreeNode[]) => {
    item.forEach((child) => {
      child.visible = filterMethod(filter, child, filterType);
      if (child.children) traverse(child.children);
      if (!child.visible && child.children?.length) {
        const visible = !child.children.some((c) => c.visible);
        child.visible = !visible;
      }
    });
  };
  traverse(_data);
  return filterDataByVisible(_data);
}

// 根据传入的值进行数据匹配, 并返回匹配结果
function filterMethod(val: string, data: TreeNode, filterType: string | number) {
  return data[filterType].includes(val);
}

// 递归过滤符合条件的数据
function filterDataByVisible(data: TreeNode[]) {
  return data.filter((item) => {
    if (item.children) {
      item.children = filterDataByVisible(item.children);
    }
    return item.visible;
  });
}

const mockData = [
  {
    children: [
      {
        children: [],
        name: '加',
        id: 'operator-1',
      },
      {
        children: [],
        name: '减',
        id: 'operator-2',
      },
      {
        children: [],
        name: '乘',
        id: 'operator-3',
      },
      {
        children: [],
        name: '除',
        id: 'operator-4',
      },
      {
        children: [],
        name: '括号',
        id: 'operator-5',
      },
      {
        children: [],
        name: '按位异或',
        id: 'operator-6',
      },
    ],
    name: '操作符',
    id: 'operator',
  },
  {
    children: [
      {
        children: [],
        name: 'if',
        id: 'if',
      },
      {
        children: [],
        name: 'for',
        id: 'for',
      },
      {
        children: [],
        name: 'while',
        id: 'while',
      },
    ],
    name: '控制语句',
    id: 'control',
  },
];
const myTree = treeFilter(mockData, '操作', 'name');

console.log(JSON.stringify(myTree), 'mytree');
