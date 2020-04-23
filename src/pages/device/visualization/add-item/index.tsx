import React, { useState } from 'react';
import 'antd/dist/antd.css';

import { List, Modal, Drawer } from 'antd';
import { SchemaForm, FormButtonGroup, Submit, Reset } from '@formily/antd';
import {
  Input,
  Radio,
  Checkbox,
  Select,
  DatePicker,
  NumberPicker,
  TimePicker,
  Upload,
  Switch,
  Range,
  Transfer,
  Rating,
} from '@formily/antd-components';

import styles from './index.less';
import { ChartsConfig } from '../config';

interface Props {
  close: Function;
  save: Function;
}

const AddItem = (props: Props) => {
  const components = {
    Input,
    Radio: Radio.Group,
    Checkbox: Checkbox.Group,
    TextArea: Input.TextArea,
    NumberPicker,
    Select,
    Switch,
    DatePicker,
    DateRangePicker: DatePicker.RangePicker,
    YearPicker: DatePicker.YearPicker,
    MonthPicker: DatePicker.MonthPicker,
    WeekPicker: DatePicker.WeekPicker,
    TimePicker,
    Upload,
    Range,
    Rating,
    Transfer,
  };

  const [type, setType] = useState<any>();
  return (
    <div>
      {type ? (
        <Drawer
          title="新增xxx"
          visible={!!type}
          onClose={() => {
            setType(undefined);
            props.close();
          }}
          width="60vw"
        >
          <SchemaForm
            onSubmit={values => {
              props.save({ config: values, component: type });
              // console.log(values, 'values');
            }}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 6 }}
            components={components}
            schema={ChartsConfig.find(item => item.id === type)?.properties}
          >
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
              }}
            >
              <FormButtonGroup offset={8} sticky>
                <Submit>提交</Submit>
                <Reset>重置</Reset>
              </FormButtonGroup>
            </div>
          </SchemaForm>
        </Drawer>
      ) : (
        <Modal visible title="新增" width="70vw" onCancel={() => props.close()}>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 6,
              xxl: 4,
            }}
            dataSource={ChartsConfig}
            renderItem={item => (
              <List.Item
                key={item.id}
                onClick={() => {
                  setType(item.id);
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    height: 180,
                    width: 180,
                    paddingTop: 10,
                  }}
                  className={styles.item}
                >
                  <img height={150} width={150} src={item.preview} alt="" />
                </div>
              </List.Item>
            )}
          />
        </Modal>
      )}
    </div>
  );
};
export default AddItem;
