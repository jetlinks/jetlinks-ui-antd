import { Button, Input, Popover, Space, Tooltip, Tree } from 'antd';
import Service from './service';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import ReactMarkdown from 'react-markdown';
import { treeFilter } from '@/utils/tree';
import type { OperatorItem } from './typings';
import { Store } from 'jetlinks-store';
import DB from '@/db';
import type { PropertyMetadata } from '@/pages/device/Product/typings';

const service = new Service();

const Operator = () => {
  const [data, setData] = useState<OperatorItem[]>([]);
  const [item, setItem] = useState<Partial<OperatorItem>>({});
  const dataRef = useRef<OperatorItem[]>([]);
  const getData = async () => {
    const _properties = (await DB.getDB().table('properties').toArray()) as PropertyMetadata[];
    const properties = {
      id: 'property',
      name: '属性',
      description: '',
      code: '',
      children: _properties.map((p) => ({
        id: p.id,
        name: p.name,
        description: `### ${p.name}
        \n 数据类型: ${p.valueType?.type}
        \n 是否只读: ${p.expands?.readOnly || 'false'}
        \n 可写数值范围: ---`,
        type: 'property',
      })),
    };
    const response = await service.getOperator();
    if (response.status === 200) {
      setData([properties, ...response.result]);
      dataRef.current = [properties, ...response.result];
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const search = (value: string) => {
    if (value) {
      const nodes = treeFilter(dataRef.current, value, 'name') as OperatorItem[];
      setData(nodes);
    } else {
      setData(dataRef.current);
    }
  };
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <div className={styles.box}>
      <Input.Search onSearch={search} allowClear placeholder="搜索关键字" />
      <Tree
        className={styles.tree}
        onSelect={(k, info) => {
          setItem(info.node as unknown as OperatorItem);
        }}
        fieldNames={{
          title: 'name',
          key: 'id',
        }}
        titleRender={(node) => (
          <div className={styles.node}>
            <div>{node.name}</div>
            <div className={node.children?.length > 0 ? styles.parent : styles.add}>
              {node.type === 'property' ? (
                <Popover
                  visible={visible}
                  placement="right"
                  title="请选择使用值"
                  content={
                    <Space direction="vertical">
                      <Tooltip
                        placement="right"
                        title="实时值为空时获取上一有效值补齐，实时值不为空则使用实时值"
                      >
                        <Button
                          type="text"
                          onClick={() => {
                            Store.set('add-operator-value', `$recent("${node.id}")`);
                            setVisible(!visible);
                          }}
                        >
                          $recent实时值
                        </Button>
                      </Tooltip>
                      <Tooltip placement="right" title="实时值的上一有效值">
                        <Button
                          onClick={() => {
                            Store.set('add-operator-value', `$lastState("${node.id}")`);
                            setVisible(!visible);
                          }}
                          type="text"
                        >
                          上一值
                        </Button>
                      </Tooltip>
                    </Space>
                  }
                  trigger="click"
                >
                  <a onClick={() => setVisible(true)}>添加</a>
                </Popover>
              ) : (
                <a
                  onClick={() => {
                    Store.set('add-operator-value', node.code);
                    setVisible(true);
                  }}
                >
                  添加
                </a>
              )}
            </div>
          </div>
        )}
        autoExpandParent={true}
        treeData={data}
      />
      <div className={styles.explain}>
        <ReactMarkdown>{item.description || ''}</ReactMarkdown>
      </div>
    </div>
  );
};
export default Operator;
