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
  TreeSelect,
} from '@formily/antd';
import type { Field, FieldDataSource } from '@formily/core';
import { createForm, onFieldReact, onFieldValueChange } from '@formily/core';
import GroupNameControl from '@/components/SearchComponent/GroupNameControl';
import {
  DeleteOutlined,
  DoubleRightOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Dropdown, Empty, Menu, message, Popover, Typography } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ProColumns } from '@jetlinks/pro-table';
import type { EnumData } from '@/utils/typings';
import styles from './index.less';
import Service from '@/components/SearchComponent/service';
import _ from 'lodash';
import { useIntl } from '@@/plugin-locale/localeExports';
import classnames from 'classnames';
import { randomString } from '@/utils/util';

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
  /** @name "搜索条件" */
  field: ProColumns<T>[];
  onSearch: (params: { terms: SearchTermsServer }) => void;
  target?: string;
  /**
   *  @name "固定查询参数"
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
  /**
   * @name "搜索组件模式"
   * simple 限制只支持一组搜索条件，用于小弹窗搜索时使用
   */
  model?: 'simple' | 'advance';
  enableSave?: boolean;
  initParam?: SearchTermsServer;
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
    TreeSelect,
  },
});

/**
 * 搜索字段排序
 * @param field
 */
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

// 保存历史记录
// 过滤不参与搜索的列数据 ==> 字段排序

// 场景一：简单模式
// 默认搜索参数，根据Index 来判断，或者默认name为第一组条件

// 场景二：高级模式
// 默认六组搜索条件。根据字段index排序

const SearchComponent = <T extends Record<string, any>>(props: Props<T>) => {
  const { field, target, onSearch, defaultParam, enableSave = true, initParam, model } = props;

  /**
   * 过滤不参与搜索的数据 ?
   * TODO Refactor 依赖透明？
   */
  const filterSearchTerm = (): ProColumns<T>[] =>
    field
      .filter((item) => item.dataIndex)
      .filter((item) => !item.hideInSearch)
      .filter((item) => !['index', 'option'].includes(item.dataIndex as string));

  /**
   * 根据dataIndex 过滤不参与查询的参数
   *
   * @param _field 查询的列
   * @param excludes 过滤的字段名称
   */
  // const filterSearchTerm2 = (_field: ProColumns<T>[] = [], excludes: string[] = []) =>
  //   _field.filter(item => item.dataIndex)
  //     .filter(item => !item.hideInSearch)
  //     .filter(item => !excludes.includes(item.dataIndex as string))

  // 处理后的搜索条件
  const processedField = sortField(filterSearchTerm());
  const defaultTerms = (index: number) =>
    ({
      termType: 'like',
      column: (processedField[index]?.dataIndex as string) || null,
      type: 'or',
    } as Partial<Term>);

  const intl = useIntl();
  const [expand, setExpand] = useState<boolean>(true);
  const initForm = server2Ui(initParam || [{ terms: [defaultTerms(0)] }]);
  const [aliasVisible, setAliasVisible] = useState<boolean>(false);
  const [initParams, setInitParams] = useState<SearchTermsUI>(initForm);
  const [history, setHistory] = useState([]);
  const [logVisible, setLogVisible] = useState<boolean>(false);
  const uiParamRef = useRef(initParam);

  const form = useMemo(
    () =>
      createForm<SearchTermsUI>({
        validateFirst: true,
        initialValues: initParams,
        effects() {
          onFieldReact('*.*.column', async (typeFiled, f) => {
            const _column = (typeFiled as Field).value;
            const _field = field.find((item) => item.dataIndex === _column);
            if (_column === 'id') {
              f.setFieldState(typeFiled.query('.termType'), async (state) => {
                state.value = 'eq';
              });
            } else {
              switch (_field?.valueType) {
                case 'select':
                  let __option: { label: any; value: any }[] | FieldDataSource | undefined = [];
                  if (_field?.valueEnum) {
                    __option = Object.values(_field?.valueEnum || {}).map((item) => ({
                      label: item.text,
                      value: item.status,
                    }));
                  } else if (_field?.request) {
                    __option = await _field.request();
                  }
                  f.setFieldState(typeFiled.query('.termType'), async (state) => {
                    state.value = 'eq';
                  });
                  f.setFieldState(typeFiled.query('.value'), async (state) => {
                    state.componentType = 'Select';
                    state.dataSource = __option;
                  });
                  break;
                case 'treeSelect':
                  let _option: { label: any; value: any }[] | FieldDataSource | undefined = [];
                  if (_field?.valueEnum) {
                    _option = Object.values(_field?.valueEnum || {}).map((item) => ({
                      label: item.text,
                      value: item.status,
                    }));
                  } else if (_field?.request) {
                    _option = await _field.request();
                  }
                  f.setFieldState(typeFiled.query('.termType'), (_state) => {
                    _state.value = 'eq';
                  });
                  f.setFieldState(typeFiled.query('.value'), (state) => {
                    state.componentType = 'TreeSelect';
                    state.dataSource = _option;
                    state.componentProps = {
                      ..._field.fieldProps,
                      treeNodeFilterProp: 'name',
                    };
                  });
                  break;
                case 'digit':
                  f.setFieldState(typeFiled.query('.value'), async (state) => {
                    state.componentType = 'NumberPicker';
                  });
                  f.setFieldState(typeFiled.query('.termType'), async (state) => {
                    state.value = 'eq';
                  });
                  break;
                case 'dateTime':
                  f.setFieldState(typeFiled.query('.value'), async (state) => {
                    state.componentType = 'DatePicker';
                    state.componentProps = { showTime: true };
                  });
                  f.setFieldState(typeFiled.query('.termType'), async (state) => {
                    state.value = 'gte';
                  });
                  break;
                default:
                  f.setFieldState(typeFiled.query('.value'), async (state) => {
                    state.componentType = 'Input';
                  });
                  break;
              }
            }
          });
          onFieldValueChange('*.*.column', (field1, form1) => {
            form1.setFieldState(field1.query('.value'), (state1) => {
              state1.value = undefined;
            });
          });
        },
      }),
    [target, expand],
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
            gridSpan: 3,
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

  const handleForm = (_expand?: boolean) => {
    const value = form.values;
    const __expand = _expand || expand;
    // 第一组条件值
    const _terms1 = _.cloneDeep(value.terms1?.[0]);
    const uiParam = uiParamRef.current;
    // 判断一下条件。。是否展开。
    if (__expand) {
      value.terms1 = [
        uiParam?.[0]?.terms?.[0] || _terms1 || defaultTerms(0),
        uiParam?.[0]?.terms?.[1] || defaultTerms(1),
        uiParam?.[0]?.terms?.[2] || defaultTerms(2),
      ];
      value.terms2 = [
        uiParam?.[1]?.terms?.[0] || defaultTerms(3),
        uiParam?.[1]?.terms?.[1] || defaultTerms(4),
        uiParam?.[1]?.terms?.[2] || defaultTerms(5),
      ];
    } else {
      value.terms1 = _terms1 ? [_terms1] : [defaultTerms(0)];
      value.terms2 = [];
    }
    setInitParams(value);
  };
  const handleExpand = () => {
    handleForm();
    setExpand(!expand);
  };

  useEffect(() => {
    //  1、一组条件时的表单值
    //  2、六组条件时的表单值
    //  3、拥有默认条件时的表单值
    // 合并初始化的值

    //expand false 6组条件 true 1组条件

    if (initParam && initParam[0].terms && initParam[0].terms.length > 1) {
      handleExpand();
    }
  }, [initParam]);

  const simpleSchema: ISchema = {
    type: 'object',
    properties: {
      terms1: createGroup('第一组'),
    },
  };

  const handleHistory = (item: SearchHistory) => {
    const log = JSON.parse(item.content) as SearchTermsUI;
    setLogVisible(false);
    uiParamRef.current = ui2Server(log);
    const _expand =
      (log.terms1 && log.terms1?.length > 1) || (log.terms2 && log.terms2?.length > 1);
    if (_expand) {
      setExpand(false);
    }
    handleForm(_expand);
  };

  const historyDom = (
    <Menu className={styles.history}>
      {history.length > 0 ? (
        history.map((item: SearchHistory) => (
          <Menu.Item onClick={() => handleHistory(item)} key={item.id || randomString(9)}>
            <div className={styles.list}>
              <Typography.Text ellipsis={{ tooltip: item.name }}>{item.name}</Typography.Text>
              <DeleteOutlined
                onClick={async (e) => {
                  e?.stopPropagation();
                  const response = await service.history.remove(`${target}-search`, item.key);
                  if (response.status === 200) {
                    message.success('操作成功');
                    const temp = history.filter((h: any) => h.key !== item.key);
                    setHistory(temp);
                  }
                }}
              />
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
      .filter((i) => i.terms && i.terms?.length > 0)
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
    const filterTerms = (data: Partial<Term>[] | undefined) =>
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
    const value = form.values;
    if (!expand) {
      value.terms1 = [defaultTerms(0), defaultTerms(1), defaultTerms(2)];
      value.terms2 = [defaultTerms(3), defaultTerms(4), defaultTerms(5)];
    } else {
      value.terms1 = [defaultTerms(0)];
      value.terms2 = [];
    }
    setInitParams(value);
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
        destroyPopupOnHide
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
                      max: 64,
                      message: '最多可输入64个字符',
                    },
                    {
                      required: true,
                      message: '请输入名称',
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
            {model !== 'simple' && (
              <div className={classnames(styles.more, !expand ? styles.simple : styles.advance)}>
                <Button type="link" onClick={handleExpand}>
                  更多筛选
                  <DoubleRightOutlined style={{ marginLeft: 32 }} rotate={expand ? 90 : -90} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Form>
    </Card>
  );
};
export default SearchComponent;
