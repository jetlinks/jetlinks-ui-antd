import MonacoEditor from 'react-monaco-editor';
import styles from './index.less';
import { Dropdown, Menu, message, Tooltip } from 'antd';
import { BugOutlined, FullscreenOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';

const symbolList = [
  {
    key: 'add',
    value: '+',
  },
  {
    key: 'subtract',
    value: '-',
  },
  {
    key: 'multiply',
    value: '*',
  },
  {
    key: 'divide',
    value: '/',
  },
  {
    key: 'parentheses',
    value: '()',
  },
  {
    key: 'cubic',
    value: '^',
  },
  {
    key: 'dayu',
    value: '>',
  },
  {
    key: 'dayudengyu',
    value: '>=',
  },
  {
    key: 'dengyudengyu',
    value: '==',
  },
  {
    key: 'xiaoyudengyu',
    value: '<=',
  },
  {
    key: 'xiaoyu',
    value: '<',
  },
  {
    key: 'jiankuohao',
    value: '<>',
  },
  {
    key: 'andand',
    value: '&&',
  },
  {
    key: 'huohuo',
    value: '||',
  },
  {
    key: 'fei',
    value: '!',
  },
  {
    key: 'and',
    value: '&',
  },
  {
    key: 'huo',
    value: '|',
  },
  {
    key: 'bolang',
    value: '~',
  },
];
const FRuleEditor = () => {
  return (
    <div className={styles.box}>
      <div className={styles.top}>
        <div className={styles.left}>
          {symbolList
            .filter((t, i) => i <= 3)
            .map((item) => (
              <span key={item.key} onClick={() => message.success(`插入数据${item.value}`)}>
                {item.value}
              </span>
            ))}
          <span>
            <Dropdown
              overlay={
                <Menu>
                  {symbolList
                    .filter((t, i) => i > 6)
                    .map((item) => (
                      <Menu.Item
                        key={item.key}
                        onClick={async () => {
                          message.success(`选中了这个${item.value}`);
                        }}
                      >
                        {item.value}
                      </Menu.Item>
                    ))}
                </Menu>
              }
            >
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                <MoreOutlined />
              </a>
            </Dropdown>
          </span>
        </div>
        <div className={styles.right}>
          <span>
            <Tooltip title="进行调试">
              <BugOutlined />
            </Tooltip>
          </span>
          <span>
            <Tooltip title="快速添加">
              <PlusOutlined />
            </Tooltip>
          </span>
          <span>
            <FullscreenOutlined />
          </span>
        </div>
      </div>
      <MonacoEditor language={'javascript'} height={300} />
    </div>
  );
};
export default FRuleEditor;
