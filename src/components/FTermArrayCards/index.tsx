import React from 'react';
import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';
import { ArrayField } from '@formily/core';
import { observer, RecursionField, useField, useFieldSchema } from '@formily/react';
import cls from 'classnames';
import { ISchema } from '@formily/json-schema';
import { usePrefixCls } from '@formily/antd/lib/__builtins__';
import { ArrayBase, ArrayBaseMixins } from '@formily/antd';
import { Empty } from '@/components';

type ComposedArrayCards = React.FC<CardProps> & ArrayBaseMixins;

const isAdditionComponent = (schema: ISchema) => {
  return schema['x-component']?.indexOf('Addition') > -1;
};

const isIndexComponent = (schema: ISchema) => {
  return schema['x-component']?.indexOf('Index') > -1;
};

const isRemoveComponent = (schema: ISchema) => {
  return schema['x-component']?.indexOf('Remove') > -1;
};

const isMoveUpComponent = (schema: ISchema) => {
  return schema['x-component']?.indexOf('MoveUp') > -1;
};

const isMoveDownComponent = (schema: ISchema) => {
  return schema['x-component']?.indexOf('MoveDown') > -1;
};

const isOperationComponent = (schema: ISchema) => {
  return (
    isAdditionComponent(schema) ||
    isRemoveComponent(schema) ||
    isMoveDownComponent(schema) ||
    isMoveUpComponent(schema)
  );
};

export const FTermArrayCards: ComposedArrayCards = observer((props) => {
  const field = useField<ArrayField>();
  const schema = useFieldSchema();
  const dataSource = Array.isArray(field.value) ? field.value : [];
  const prefixCls = usePrefixCls('formily-array-cards', props);

  if (!schema) throw new Error('can not found schema object');

  const renderItems = () => {
    return dataSource?.map((item, index) => {
      const items = Array.isArray(schema.items)
        ? schema.items[index] || schema.items[0]
        : schema.items;
      const title = (
        <span>
          <RecursionField
            schema={items!}
            name={index}
            filterProperties={(schema4) => {
              if (!isIndexComponent(schema4)) return false;
              return true;
            }}
            onlyRenderProperties
          />
          {props.title || field.title}
        </span>
      );
      const extra = (
        <span>
          <RecursionField
            schema={items!}
            name={index}
            filterProperties={(schema1) => {
              if (!isOperationComponent(schema1)) return false;
              return true;
            }}
            onlyRenderProperties
          />
          {props.extra}
        </span>
      );
      const content = (
        <RecursionField
          schema={items!}
          name={index}
          filterProperties={(schema2) => {
            if (isIndexComponent(schema2)) return false;
            if (isOperationComponent(schema2)) return false;
            return true;
          }}
        />
      );
      return (
        ArrayBase.Item && (
          <ArrayBase.Item key={index} index={index} record={item}>
            {index > 0 && (
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
                <RecursionField
                  schema={
                    {
                      type: 'object',
                      properties: {
                        type: {
                          'x-decorator': 'FormItem',
                          'x-component': 'Select',
                          'x-component-props': {
                            style: {
                              width: 100,
                            },
                          },
                          'x-value': 'and',
                          enum: [
                            { label: '并且', value: 'and' },
                            { label: '或者', value: 'or' },
                          ],
                        },
                      },
                    } as any
                  }
                  name={index}
                  filterProperties={(schema2) => {
                    if (isIndexComponent(schema2)) return false;
                    if (isOperationComponent(schema2)) return false;
                    return true;
                  }}
                />
              </div>
            )}
            <Card
              {...props}
              onChange={() => {}}
              className={cls(`${prefixCls}-item`, props.className)}
              title={title}
              extra={extra}
            >
              {content}
            </Card>
          </ArrayBase.Item>
        )
      );
    });
  };

  const renderAddition = () => {
    return schema.reduceProperties((addition: any, schema3: any, key: any) => {
      if (isAdditionComponent(schema3)) {
        return <RecursionField schema={schema3} name={key} />;
      }
      return addition;
    }, null);
  };

  const renderEmpty = () => {
    if (dataSource?.length) return;
    return (
      <Card
        {...props}
        onChange={() => {}}
        className={cls(`${prefixCls}-item`, props.className)}
        title={props.title || field.title}
      >
        <Empty />
      </Card>
    );
  };

  return (
    <ArrayBase>
      {renderEmpty()}
      {renderItems()}
      {renderAddition()}
    </ArrayBase>
  );
});

FTermArrayCards.displayName = 'FTermArrayCards';

ArrayBase.mixin!(FTermArrayCards);

export default FTermArrayCards;
