import React, {useEffect, useState} from 'react';
import Form, {FormComponentProps} from 'antd/lib/form';
import {Button, Col, Input, Row, Select, TreeSelect} from 'antd';
import apis from '@/services';
import SearchTags from "@/pages/device/instance/Search/tags/tags";

interface Props extends FormComponentProps {
  search: Function;
}

interface State {
  parameterType: string;
  organizationList: any[];
  tagsData: any[];
  tagsValue: any;
}

const Search: React.FC<Props> = props => {

  const {
    form,
    form: {getFieldDecorator},
  } = props;

  const initState: State = {
    parameterType: 'id',
    organizationList: [],
    tagsData: [],
    tagsValue: undefined,
  };

  const [parameterType, setParameterType] = useState(initState.parameterType);
  const [organizationList, setOrganizationList] = useState(initState.organizationList);
  const [tagsVisible, setTagsVisible] = useState(false);
  const [tagsValue, setTagsValue] = useState(initState.tagsValue);
  const [tagsData, setTagsData] = useState(initState.tagsData);

  useEffect(() => {
    setParameterType('id');
    form.setFieldsValue({parameter: 'id'});

    apis.deviceProdcut.queryOrganization()
      .then(res => {
        if (res.status === 200) {
          let orgList: any = [];
          res.result.map((item: any) => {
            orgList.push({id: item.id, pId: item.parentId, value: item.id, title: item.name})
          });
          setOrganizationList(orgList);
        }
      }).catch(() => {
    });

  }, []);

  const search = () => {
    const data = form.getFieldsValue();
    // TODO 查询数据
    const map = {};
    if (data.parameter === 'orgId$in') {
      data.value = JSON.stringify(data.value).replace(/[\[\]"]/g, '');
    } else if (data.parameter === 'id$dev-tag') {
      data.value = tagsData.length > 0 ? JSON.stringify(tagsData) : undefined;
    }
    map[data.parameter] = data.value;

    props.search(map);
  };

  const renderType = () => {
    switch (parameterType) {
      case 'id':
      case 'name$like':
        return (
          <>
            {getFieldDecorator('value', {})(
              <Input placeholder="请输入" style={{width: 'calc(100% - 100px)'}}/>,
            )}
          </>
        );
      case 'orgId$in':
        return (
          <>
            {getFieldDecorator('value', {})(
              <TreeSelect
                style={{width: 'calc(100% - 100px)'}}
                allowClear treeDataSimpleMode showSearch multiple
                placeholder="所属机构，可根据机构名称模糊查询" treeData={organizationList}
                treeNodeFilterProp='title'
              />
            )}
          </>
        );
      case 'id$dev-tag':
        return (
          <>
            {getFieldDecorator('value', {
              initialValue: tagsValue
            })(
              <Input placeholder="点击选择设备标签" onClick={() => {
                setTagsVisible(true);
              }} style={{width: 'calc(100% - 100px)'}}/>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 4},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 20},
    },
  };

  return (
    <Form {...formItemLayout}>
      <Row gutter={{md: 8, lg: 24, xl: 48}}>
        <Col md={8} sm={24} key='parameter'>
          <Input.Group compact>
            {getFieldDecorator('parameter', {
              initialValue: parameterType,
            })(
              <Select style={{width: 100}} placeholder="请选择"
                      onChange={(value: string) => {
                        setParameterType(value);
                      }}>
                <Select.Option value="id" key="id">设备ID</Select.Option>
                <Select.Option value="name$like" key="name$like">设备名称</Select.Option>
                <Select.Option value="orgId$in" key="orgId$in">所属机构</Select.Option>
                <Select.Option value="id$dev-tag" key="id$dev-tag">设备标签</Select.Option>
              </Select>,
            )}
            {renderType()}
          </Input.Group>
        </Col>

        <div style={{
          float: 'right',
          marginBottom: 24,
          marginRight: 30,
          marginTop: 4
        }}>
          <Button type="primary" style={{marginLeft: 8}} onClick={() => {
            search();
          }}>
            查询
          </Button>
          <Button style={{marginLeft: 8}} onClick={() => {
            form.resetFields();
            form.setFieldsValue({parameter: 'id', value: undefined});
            setParameterType('id');
            setTagsValue(undefined);
            setTagsData([]);
            props.search({});
          }}>
            重置
          </Button>
        </div>
      </Row>
      {tagsVisible && (
        <SearchTags data={tagsData}
                    close={() => {
                      setTagsVisible(false);
                    }}
                    save={(item: any) => {
                      let displayData: any[] = [];
                      item.map((item: any) => {
                        displayData.push(`${item.key}=${item.value}`);
                      });
                      setTagsValue(displayData.join('；'));
                      setTagsData(item);
                      setTagsVisible(false);
                    }}
        />
      )}
    </Form>
  );
};

export default Form.create<Props>()(Search);
