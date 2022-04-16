## 权限组件 PermissionButton

### Props

- 继承于`ButtonProps`，进行额外拓展

| 名称         | 类型            | 必传 |
| ------------ | --------------- | ---- |
| tooltip      | TooltipProps    | 否   |
| popConfirm   | PopconfirmProps | 否   |
| isPermission | boolean         | 否   |

import { PermissionButton } from '@/components';

const { permission } = PermissionButton.usePermission('system/Department')

<PermissionButton popConfirm={{
    title:intl.formatMessage({
      id: 'pages.system.role.option.delete',
      defaultMessage: '确定要删除吗',
    }),
      onConfirm(){
      deleteItem(record.id);
    }
  }} tooltip={{
    title: intl.formatMessage({
      id: 'pages.data.option.delete',
      defaultMessage: '删除',
    })
  }} isPermission={permission.delete}

> 按钮 </PermissionButton>
