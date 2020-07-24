import {groupBy} from 'lodash';
import {Unit} from '@/utils/unit';
import {AutoComplete, Input, Select} from 'antd';
import React, {ReactNode} from 'react';

export function renderUnit(units: any): ReactNode {
  const filterOption = (inputValue: string, option: any) => {
    return option.key.indexOf(inputValue) != -1;
  };
  const grouped = groupBy(units, unit => unit.type);
  const types = Array.from(new Set<string>(units.map((unit: any) => {
    return unit.type;
  })));
  const options = types.map(type => {
    const typeData = grouped[type];
    return (
      <Select.OptGroup label={type} key={type}>
        {
          typeData.map((e: Unit) => {
            return <Select.Option value={e.id} key={`${e.name}/${e.symbol}`}
                                  title={`${e.name}/${e.symbol}`}>{e.name} / {e.symbol}</Select.Option>
          })
        }
      </Select.OptGroup>
    );
  });

  return (
    <AutoComplete
      dropdownMatchSelectWidth={false}
      dropdownStyle={{width: 300}}
      style={{width: '100%'}}
      dataSource={options}
      optionLabelProp="title"
      filterOption={(inputValue, option) => {
        return filterOption(inputValue, option);
      }}
    >
      <Input/>
    </AutoComplete>
  );
}

