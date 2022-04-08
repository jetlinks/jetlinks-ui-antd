import type { ISchema } from '@formily/json-schema';
import { createSchemaField } from '@formily/react';
import {
  ArrayItems,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormTab,
  Input,
  NumberPicker,
  PreviewText,
  Select,
  Space,
} from '@formily/antd';
import type { Field, FieldDataSource } from '@formily/core';
import { createForm, onFieldReact, onFormInit } from '@formily/core';
import GroupNameControl from '@/components/SearchComponent/GroupNameControl';
import {
  DeleteOutlined,
  DoubleRightOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@ant-design/icons';
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
import classnames from 'classnames';

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
  /**
   *  @name 固定查询参数
   *  eg: 1: {[{ column: 'test', value: 'admin' }]}
   *      2: {[
   *            {
   *              terms: [{ column: 'parentId$isnull', value: '' }, { column: 'parentId$not', value: 'test', type: 'or' }],
   *            },
   *            {
   *              terms: [{ column: 'id$not', value: 'test', type: 'and' }],
   *            },
   *         ]}
   * */
  defaultParam?: SearchTermsServer | Term[];
  // pattern?: 'simple' | 'advance';
  enableSave?: boolean;
}

const termType = [
  { label: '=', value: 'eq' },
  { label: '!=', value: 'not' },
  { label: '包含', value: 'like' },
  { label: '不包含', value: 'nlike' },
  { label: '>', value: 'gt' },
  { label: '>=', value: 'gte' },
  { label: '<', value: 'lt' },
  { label: '<=', value: 'lte' },
  { label: '属于', value: 'in' },
  { label: '不属于', value: 'nin' },
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
    DatePicker,
    PreviewText,
    GroupNameControl,
    Space,
  },
});

const sortField = (field: ProColumns[]) => {
  let _temp = false;
  field.forEach((item) => {
    if (item.index) {
      _temp = true;
      return;
    }
  });

  if (!_temp) {
    // 如果没有index 就默认name字段最第一个
    field.map((item) => {
      console.log(item, 'items');
      if (item.dataIndex === 'name') {
        item.index = 0;
        return item;
      } else {
        return item;
      }
    });
  }
  // index排序
  return _.sortBy(field, (i) => i.index);
};

const SearchComponent = <T extends Record<string, any>>(props: Props<T>) => {
  const { field, target, onSearch, defaultParam, enableSave = true } = props;

  const intl = useIntl();
  const [expand, setExpand] = useState<boolean>(true);
  const initForm = server2Ui([{ terms: [initTerm] }]);
  const [logVisible, setLogVisible] = useState<boolean>(false);
  const [aliasVisible, setAliasVisible] = useState<boolean>(false);
  const [initParams, setInitParams] = useState<SearchTermsUI>(initForm);
  const [history, setHistory] = useState([]);

  /**
   * 过滤不参与搜索的数据
   */
  const filterSearchTerm = (): ProColumns<T>[] =>
    field
      .filter((item) => item.dataIndex)
      .filter((item) => !item.hideInSearch)
      .filter((item) => !['index', 'option'].includes(item.dataIndex as string));
  // 处理后的搜索条件
  const processedField = sortField(filterSearchTerm());

  const form = useMemo(
    () =>
      createForm<SearchTermsUI>({
        validateFirst: true,
        initialValues: initParams,
        effects() {
          onFormInit((form1) => {
            if (expand) {
              form1.setValues({
                terms1: [{ column: processedField[0]?.dataIndex, termType: 'like' }],
              });
            }
          });
          onFieldReact('*.*.column', async (typeFiled, f) => {
            const _column = (typeFiled as Field).value;
            const _field = field.find((item) => item.dataIndex === _column);
            if (_field?.valueType === 'select') {
              let option: { label: any; value: any }[] | FieldDataSource | undefined = [];
              if (_field?.valueEnum) {
                option = Object.values(_field?.valueEnum || {}).map((item) => ({
                  label: item.text,
                  value: item.status,
                }));
              } else if (_field?.request) {
                option = await _field.request();
              }
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
            } else if (_field?.valueType === 'dateTime') {
              f.setFieldState(typeFiled.query('.value'), async (state) => {
                state.componentType = 'DatePicker';
                state.componentProps = { showTime: true };
              });
              f.setFieldState(typeFiled.query('.termType'), async (state) => {
                state.value = 'gt';
              });
            } else {
              f.setFieldState(typeFiled.query('.value'), async (state) => {
                state.componentType = 'Input';
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
        minColumns: 14,
        maxColumns: 14,
        columnGap: 24,
        // rowGap: 1,
      },
      properties: {
        type: {
          'x-decorator': 'FormItem',
          'x-component': 'GroupNameControl',
          'x-decorator-props': {
            gridSpan: 2,
          },
          default: 'or',
          'x-component-props': {
            name: name,
          },
          'x-visible': !expand,
        },
        column: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-decorator-props': {
            gridSpan: 3,
          },
          'x-component-props': {
            placeholder: '请选择',
          },
          enum: filterSearchTerm().map((i) => ({ label: i.title, value: i.dataIndex } as EnumData)),
        },
        termType: {
          type: 'enum',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-decorator-props': {
            gridSpan: 3,
          },
          default: 'like',
          enum: termType,
        },
        value: {
          'x-decorator-props': {
            gridSpan: 6,
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

  const handleExpand = () => {
    const value = form.values;

    if (expand) {
      value.terms1 = [0, 1, 2].map((i) => ({
        termType: 'like',
        column: (processedField[i]?.dataIndex as string) || null,
        type: 'or',
      }));
      value.terms2 = [3, 4, 5].map((i) => ({
        termType: 'like',
        column: (processedField[i]?.dataIndex as string) || null,
        type: 'or',
      }));
    } else {
      value.terms1 = [
        { termType: 'like', column: (processedField[0].dataIndex as string) || null },
      ];
      value.terms2 = [];
    }
    setInitParams(value);
    setExpand(!expand);
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

  const formatValue = (value: SearchTermsUI): SearchTermsServer => {
    let _value = ui2Server(value);

    // 处理默认查询参数
    if (defaultParam && defaultParam?.length > 0) {
      if ('terms' in defaultParam[0]) {
        _value = _value.concat(defaultParam as SearchTermsServer);
      } else if ('value' in defaultParam[0]) {
        _value = _value.concat([{ terms: defaultParam }]);
      }
    }
    return _value
      .filter((i) => i.terms?.length > 0)
      .map((term) => {
        term.terms?.map((item) => {
          if (item.termType === 'like') {
            item.value = `%${item.value}%`;
            return item;
          }
          return item;
        });
        return term;
      });
  };

  const handleSearch = async () => {
    const value = form.values;
    const filterTerms = (data: Partial<Term>[]) =>
      data && data.filter((item) => item.column != null).filter((item) => item.value !== undefined);
    const _terms = _.cloneDeep(value);
    _terms.terms1 = filterTerms(_terms.terms1);
    _terms.terms2 = filterTerms(_terms.terms2);

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
    await form.reset();
    await handleSearch();
  };

  const SearchBtn = {
    simple: (
      <Button icon={<SearchOutlined />} onClick={handleSearch} type="primary">
        搜索
      </Button>
    ),
    advance: (
      <Dropdown.Button
        icon={<SearchOutlined />}
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
    ),
  };

  const SaveBtn = (
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
      <Button icon={<SaveOutlined />} block>
        {intl.formatMessage({
          id: 'pages.data.option.save',
          defaultMessage: '保存',
        })}
      </Button>
    </Popover>
  );

  return (
    <Card bordered={false} className={styles.container}>
      <Form form={form} className={styles.form} labelCol={4} wrapperCol={18}>
        <div className={expand && styles.simple}>
          <SchemaField schema={expand ? simpleSchema : schema} />
          <div className={styles.action} style={{ marginTop: expand ? 0 : -12 }}>
            <Space>
              {enableSave ? SearchBtn.advance : SearchBtn.simple}
              {enableSave && SaveBtn}
              <Button icon={<ReloadOutlined />} block onClick={resetForm}>
                重置
              </Button>
            </Space>
            <div className={classnames(styles.more, !expand ? styles.simple : styles.advance)}>
              <Button type="link" onClick={handleExpand}>
                更多筛选
                <DoubleRightOutlined style={{ marginLeft: 32 }} rotate={expand ? 90 : -90} />
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </Card>
  );
};
export default SearchComponent;
