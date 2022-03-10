import type { ISchema } from '@formily/json-schema';
import { createSchemaField } from '@formily/react';
import {
  ArrayItems,
  Form,
  FormButtonGroup,
  FormGrid,
  FormItem,
  FormTab,
  Input,
  NumberPicker,
  PreviewText,
  Select,
  Space,
} from '@formily/antd';
import type { Field } from '@formily/core';
import { createForm, onFieldReact } from '@formily/core';
import GroupNameControl from '@/components/SearchComponent/GroupNameControl';
import { DeleteOutlined, DoubleRightOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  Empty,
  Menu,
  message,
  Popconfirm,
  Popover,
  Typography,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import type { ProColumns } from '@jetlinks/pro-table';
import type { EnumData } from '@/utils/typings';
import styles from './index.less';
import Service from '@/components/SearchComponent/service';
import _ from 'lodash';
import { useIntl } from '@@/plugin-locale/localeExports';

const ui2Server = (source: SearchTermsUI): SearchTermsServer => [
  { terms: source.terms1 },
  { terms: source.terms2, type: source.type },
];

const server2Ui = (source: SearchTermsServer): SearchTermsUI => ({
  terms1: source[0].terms,
  terms2: source[1]?.terms,
  type: source[0]?.type || 'and',
});

interface Props<T> {
  /** @name 搜索条件 */
  field: ProColumns<T>[];
  onSearch: (params: { terms: SearchTermsServer }) => void;
  target?: string;
  onReset?: () => void;
  /** @name 固定查询参数*/
  defaultParam?: Term[];
  pattern?: 'simple' | 'advance';
}

const termType = [
  { label: '=', value: 'eq' },
  { label: '!=', value: 'not' },
  { label: '包含', value: 'like' },
  { label: '不包含', value: 'not like' },
  { label: '>', value: 'gt' },
  { label: '>=', value: 'gte' },
  { label: '<', value: 'lt' },
  { label: '<=', value: 'lte' },
  { label: '属于', value: 'in' },
  { label: '不属于', value: 'not in' },
];

const service = new Service();
const initTerm = { termType: 'like' };
const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormTab,
    Input,
    Select,
    NumberPicker,
    FormGrid,
    ArrayItems,
    PreviewText,
    GroupNameControl,
    Space,
  },
});

const SearchComponent = <T extends Record<string, any>>(props: Props<T>) => {
  const { field, target, onReset, onSearch, defaultParam, pattern = 'advance' } = props;
  const intl = useIntl();
  const [expand, setExpand] = useState<boolean>(true);
  const initForm = server2Ui(
    pattern === 'advance'
      ? [
          {
            terms: [initTerm],
            type: 'and',
          },
          { terms: [initTerm] },
        ]
      : [{ terms: [initTerm] }],
  );
  const [logVisible, setLogVisible] = useState<boolean>(false);
  const [aliasVisible, setAliasVisible] = useState<boolean>(false);
  const [initParams, setInitParams] = useState<SearchTermsUI>(initForm);
  const [history, setHistory] = useState([]);

  const form = useMemo(
    () =>
      createForm<SearchTermsUI>({
        validateFirst: true,
        initialValues: initParams,
        effects() {
          onFieldReact('*.*.column', (typeFiled, f) => {
            const _column = (typeFiled as Field).value;
            const _field = field.find((item) => item.dataIndex === _column);
            if (_field?.valueType === 'select') {
              const option = Object.values(_field?.valueEnum || {}).map((item) => ({
                label: item.text,
                value: item.status,
              }));
              f.setFieldState(typeFiled.query('.termType'), async (state) => {
                state.value = 'eq';
              });
              f.setFieldState(typeFiled.query('.value'), async (state) => {
                state.componentType = 'Select';
                state.loading = true;
                state.dataSource = option;
                state.loading = false;
              });
            } else if (_field?.valueType === 'digit') {
              f.setFieldState(typeFiled.query('.value'), async (state) => {
                state.componentType = 'NumberPicker';
              });
              f.setFieldState(typeFiled.query('.termType'), async (state) => {
                state.value = 'eq';
              });
            }
          });
        },
      }),
    [expand],
  );

  const historyForm = createForm();

  const queryHistory = async () => {
    const response = await service.history.query(`${target}-search`);
    if (response.status === 200) {
      setHistory(response.result);
    }
  };

  const handleExpand = () => {
    const value = form.values;
    if (!expand) {
      value.terms1.splice(1, 2);
      value.terms2.splice(1, 2);
    } else {
      value.terms2.push(initTerm, initTerm);
      value.terms1.push(initTerm, initTerm);
    }
    setInitParams(value);
    setExpand(!expand);
  };

  const filterSearchTerm = (): EnumData[] =>
    field
      .filter((item) => item.dataIndex)
      .filter((item) => !item.hideInSearch)
      .filter((item) => !['index', 'option'].includes(item.dataIndex as string))
      .map((i) => ({ label: i.title, value: i.dataIndex } as EnumData));

  const createGroup = (name: string): ISchema => ({
    'x-decorator': 'FormItem',
    'x-decorator-props': {
      gridSpan: 4,
    },
    'x-component': 'ArrayItems',
    type: 'array',
    'x-value': new Array(expand ? 1 : 3).fill({ termType: 'like' }),
    items: {
      type: 'object',
      'x-component': 'FormGrid',
      'x-component-props': {
        minColumns: 6,
        maxColumns: 6,
      },
      properties: {
        type: {
          'x-decorator': 'FormItem',
          'x-component': 'GroupNameControl',
          'x-decorator-props': {
            gridSpan: 1,
          },
          'x-component-props': {
            name: name,
          },
          'x-visible': pattern === 'advance',
        },
        column: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-decorator-props': {
            gridSpan: 2,
          },
          'x-component-props': {
            placeholder: '请选择',
          },
          enum: filterSearchTerm(),
        },
        termType: {
          type: 'enum',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-decorator-props': {
            gridSpan: 1,
          },
          default: 'like',
          enum: termType,
        },
        value: {
          'x-decorator-props': {
            gridSpan: 2,
          },
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          minColumns: 9,
          maxColumns: 9,
        },
        properties: {
          terms1: createGroup('第一组'),
          type: {
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-decorator-props': {
              gridSpan: 1,
              style: {
                display: 'flex',
                alignItems: 'center',
                marginTop: '-22px',
                padding: '0 30px',
              },
            },
            default: 'and',
            enum: [
              { label: '并且', value: 'and' },
              { label: '或者', value: 'or' },
            ],
          },
          terms2: createGroup('第二组'),
        },
      },
    },
  };

  const simpleSchema: ISchema = {
    type: 'object',
    properties: {
      terms1: createGroup('第一组'),
    },
  };
  const handleHistory = (item: SearchHistory) => {
    const log = JSON.parse(item.content) as SearchTermsUI;
    form.setValues(log);
    setExpand(!(log.terms1?.length > 1 || log.terms2?.length > 1));
  };

  const historyDom = (
    <Menu className={styles.history}>
      {history.length > 0 ? (
        history.map((item: SearchHistory) => (
          <Menu.Item onClick={() => handleHistory(item)} key={item.id}>
            <div className={styles.list}>
              <Typography.Text ellipsis={{ tooltip: item.name }}>{item.name}</Typography.Text>
              <Popconfirm
                onConfirm={async (e) => {
                  e?.stopPropagation();
                  const response = await service.history.remove(`${target}-search`, item.key);
                  if (response.status === 200) {
                    message.success('操作成功');
                    const temp = history.filter((h: any) => h.key !== item.key);
                    setHistory(temp);
                  }
                }}
                title={'确认删除吗？'}
              >
                <DeleteOutlined onClick={(e) => e.stopPropagation()} />
              </Popconfirm>
            </div>
          </Menu.Item>
        ))
      ) : (
        <Menu.Item>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '148px',
            }}
          >
            <Empty />
          </div>
        </Menu.Item>
      )}
    </Menu>
  );

  const formatValue = (value: SearchTermsUI): SearchTermsServer =>
    ui2Server(value).map((term) => {
      term.terms?.map((item) => {
        if (item.termType === 'like') {
          item.value = `%${item.value}%`;
          return item;
        }
        return item;
      });
      return term;
    });

  const handleSearch = async () => {
    const value = form.values;
    const filterTerms = (data: Partial<Term>[]) =>
      data && data.filter((item) => item.column != null).filter((item) => item.value != null);
    const _terms = _.cloneDeep(value);
    _terms.terms1 = filterTerms(_terms.terms1);
    _terms.terms2 = filterTerms(_terms.terms2);
    if (defaultParam) {
      _terms.terms1 = _terms.terms1.concat(defaultParam);
    }
    onSearch({ terms: formatValue(_terms) });
  };

  useEffect(() => {
    if (defaultParam) {
      handleSearch();
    }
  }, []);

  const handleSaveLog = async () => {
    const value = await form.submit<SearchTermsUI>();
    const value2 = await historyForm.submit<{ alias: string }>();
    const response = await service.history.save(`${target}-search`, {
      name: value2.alias,
      content: JSON.stringify(value),
    });
    if (response.status === 200) {
      message.success('保存成功!');
    } else {
      message.error('保存失败');
    }
    setAliasVisible(!aliasVisible);
  };

  const resetForm = async () => {
    const temp = initForm;
    const expandData = Array(expand ? 1 : 3).fill(initTerm);
    temp.terms1 = expandData;
    temp.terms2 = expandData;
    // setInitParams(temp);
    await form.reset();
    onReset?.();
  };

  const renderAdvance = () => {
    return (
      <>
        <SchemaField schema={schema} />
        <div className={styles.action}>
          <FormButtonGroup.FormItem labelCol={10} wrapperCol={14}>
            <Dropdown.Button
              placement={'bottomLeft'}
              trigger={['click']}
              onClick={handleSearch}
              visible={logVisible}
              onVisibleChange={async (visible) => {
                setLogVisible(visible);
                if (visible) {
                  await queryHistory();
                }
              }}
              type="primary"
              overlay={historyDom}
            >
              搜索
            </Dropdown.Button>
            <Popover
              content={
                <Form style={{ width: '217px' }} form={historyForm}>
                  <SchemaField
                    schema={{
                      type: 'object',
                      properties: {
                        alias: {
                          'x-decorator': 'FormItem',
                          'x-component': 'Input.TextArea',
                          'x-validator': [
                            {
                              max: 50,
                              message: '最多可输入50个字符',
                            },
                          ],
                        },
                      },
                    }}
                  />
                  <Button onClick={handleSaveLog} type="primary" className={styles.saveLog}>
                    保存
                  </Button>
                </Form>
              }
              visible={aliasVisible}
              onVisibleChange={setAliasVisible}
              title="搜索名称"
              trigger="click"
            >
              <Button block>
                {intl.formatMessage({
                  id: 'pages.data.option.save',
                  defaultMessage: '保存',
                })}
              </Button>
            </Popover>
            <Button block onClick={resetForm}>
              重置
            </Button>
          </FormButtonGroup.FormItem>
          <div>
            <DoubleRightOutlined
              onClick={handleExpand}
              style={{ fontSize: 20 }}
              rotate={expand ? 90 : -90}
            />
          </div>
        </div>
      </>
    );
  };
  const renderSimple = () => {
    return (
      <div className={styles.simple}>
        <SchemaField schema={simpleSchema} />
        <FormButtonGroup.FormItem labelCol={0} wrapperCol={14}>
          <Button onClick={handleSearch} type="primary">
            搜索
          </Button>
          <Button block onClick={resetForm}>
            重置
          </Button>
        </FormButtonGroup.FormItem>
      </div>
    );
  };
  return (
    <Card bordered={false} style={{ marginBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
      <Form form={form} className={styles.form} labelCol={4} wrapperCol={18}>
        {pattern === 'advance' ? renderAdvance() : renderSimple()}
      </Form>
    </Card>
  );
};
export default SearchComponent;
