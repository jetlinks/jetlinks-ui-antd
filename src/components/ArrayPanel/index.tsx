import React, { Fragment } from 'react'
import {
  ISchemaFieldComponentProps,
  SchemaField
} from '@formily/react-schema-renderer'
import { toArr, isFn, FormPath } from '@formily/shared'
import { ArrayList } from '@formily/react-shared-components'
import { CircleButton } from '@formily/antd-components/esm/circle-button'
import { TextButton } from '@formily/antd-components/esm/text-button'
import { Card, Collapse } from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons'
import styled from 'styled-components'

const ArrayComponents = {
  CircleButton,
  TextButton,
  AdditionIcon: () => <PlusOutlined />,
  RemoveIcon: () => <DeleteOutlined />,
  MoveDownIcon: () => <DownOutlined />,
  MoveUpIcon: () => <UpOutlined />
}

export const ArrayPanels: any = styled(
  (props: ISchemaFieldComponentProps & { className: string }) => {
    const { value, schema, className, editable, path, mutators } = props
    const {
      renderAddition,
      renderRemove,
      renderMoveDown,
      renderMoveUp,
      renderEmpty,
      renderExtraOperations,
      ...componentProps
    } = schema.getExtendsComponentProps() || {}

    const schemaItems = Array.isArray(schema.items)
      ? schema.items[schema.items.length - 1]
      : schema.items

    const onAdd = () => {
      if (schemaItems) {
        mutators.push(schemaItems.getEmptyValue())
      }
    }
    return (
      <div className={className}>
        <ArrayList
          value={value}
          minItems={schema.minItems}
          maxItems={schema.maxItems}
          editable={editable}
          components={ArrayComponents}
          renders={{
            renderAddition,
            renderRemove,
            renderMoveDown,
            renderMoveUp,
            renderEmpty
          }}
        >
          <Collapse
            expandIconPosition="left"
            bordered={false}
          >
            {toArr(value).map((item, index) => {
              return (
                <Collapse.Panel
                  className='panel-list-item'
                  {...componentProps}
                  key={index}
                  header={<span className="item-title">{item.name || index + 1}</span>}
                  extra={
                    <Fragment>
                      <ArrayList.Remove
                        index={index}
                        onClick={(event) => { event.stopPropagation(); mutators.remove(index) }}
                      />
                      <ArrayList.MoveDown
                        index={index}
                        onClick={(event) => { event.stopPropagation(); mutators.moveDown(index) }}
                      />
                      <ArrayList.MoveUp
                        index={index}
                        onClick={(event) => { event.stopPropagation(); mutators.moveUp(index) }}
                      />
                      {isFn(renderExtraOperations)
                        ? renderExtraOperations(index)
                        : renderExtraOperations}
                    </Fragment>
                  }
                >
                  {schemaItems && (
                    <SchemaField
                      path={FormPath.parse(path).concat(index)}
                      schema={schemaItems}
                    />
                  )}
                </Collapse.Panel>
              )
            })}
          </Collapse>

          <ArrayList.Empty>
            {({ children, allowAddition }) => {
              return (
                <Card
                  {...componentProps}
                  size="small"
                  className={`panel-list-item panel-list-empty ${allowAddition ? 'add-pointer' : ''}`}
                  onClick={allowAddition ? onAdd : undefined}
                  style={{ textAlign: 'center' }}
                >
                  <div className="empty-wrapper">{children}</div>
                </Card>
              )
            }}
          </ArrayList.Empty>
          <ArrayList.Addition>
            {({ children, isEmpty }) => {
              if (!isEmpty) {
                return (
                  <div className="array-panels-addition" onClick={onAdd}>
                    {children}
                  </div>
                )
              } else {
                return null
              }
            }}
          </ArrayList.Addition>
        </ArrayList>
      </div>
    )
  }
) <ISchemaFieldComponentProps>`
  width: 100%;
  .ant-collapse {
    .ant-collapse {
      box-shadow: none;
    }
    .ant-collapse-header{
      height: 55px;
     .item-title{
        line-height:30px
      }

      .ant-collapse-extra button{
        margin:0 3px 8px 2px
      }
    }
    .ant-panel-body {
      padding: 20px 10px 0 10px;
    }
    .array-panels-addition {
      box-shadow: none;
      border: 1px solid #eee;
      transition: all 0.35s ease-in-out;
      &:hover {
        border: 1px solid #ccc;
      }
    }
    .empty-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 10px;
      img {
        height: 85px;
      }
      .ant-btn {
        color: #888;
      }
    }
  }
  .panel-list-empty.panel-list-item.add-pointer {
    cursor: pointer;
  }

  .array-panels-addition {
    margin-top: 10px;
    margin-bottom: 3px;
    background: #fff;
    display: flex;
    cursor: pointer;
    padding: 5px 0;
    justify-content: center;
    box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.1);
  }
  .panel-list-item {
    margin-top: 10px;
    border: 1px solid #eee;
  }
  .panel-list-item:first-child {
    margin-top: 0 !important;
  }
  .ant-panel-extra {
    display: flex;
    button {
      margin-right: 8px;
    }
  }
`

ArrayPanels.isFieldComponent = true

export default ArrayPanels
