import React, { Component } from 'react';
import { Card, Checkbox, Col, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import watermark from 'water-mark-oc';

interface PersonProps { }

interface PersonState {
  checkedList: string[];
  indeterminate: boolean;
  checkAll: boolean;
}
const plainOptions = [
  {
    label: <Button>新增</Button>,
    value: 'add',
  },
  {
    label: <Button>删除</Button>,
    value: 'delete',
  },
  {
    label: <Button>查询</Button>,
    value: 'query',
  },
];
const defaultCheckedList = ['add', 'query'];

class Person extends Component<PersonProps, PersonState> {
  state = {
    checkedList: defaultCheckedList,
  };

  componentDidMount() {
    // watermark({ content: '联系QQ:448929489,演示专用', width: '400px', height: '300px' });
  }

  onChange = checkedList => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length,
    });
  };

  onCheckAllChange = e => {
    this.setState({
      checkedList: e.target.checked ? plainOptions.map(e => e.value) : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };
  render() {
    const { checkedList } = this.state;
    return (
      <PageHeaderWrapper title="人员管理">
        <Card bordered={false}>
          <div style={{ borderBottom: '1px solid #E9E9E9' }}>
            <Checkbox
              indeterminate={!!checkedList.length && checkedList.length < plainOptions.length}
              onChange={this.onCheckAllChange}
              checked={checkedList.length === plainOptions.length}
            >
              Check all
            </Checkbox>
          </div>
          <br />
          <Checkbox.Group value={checkedList} options={plainOptions} onChange={this.onChange} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Person;
