import { groupBy } from 'lodash';
import { Unit } from '@/utils/unit';
import { Select } from 'antd';
import React, { ReactNode } from 'react';

export function renderUnit(units:any): ReactNode {
  const grouped = groupBy(units, unit => unit.type);
  const types = Array.from(new Set<string>(units.map((unit: any) => {
    return unit.type;
  })));
  return (
    <Select allowClear>
      {
        types.map(type => {
          const typeData = grouped[type];
          return (
            <Select.OptGroup label={type} key={type}>
              {
                typeData.map((e: Unit) => {
                  return <Select.Option value={e.id} key={e.id}>{e.name} / {e.symbol}</Select.Option>
                })
              }
            </Select.OptGroup>
          );
        })
      }
    </Select>
  );
}
