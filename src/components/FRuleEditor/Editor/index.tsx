import styles from '@/components/FRuleEditor/index.less';
import { Dropdown, Menu, Tooltip } from 'antd';
import { FullscreenOutlined, MoreOutlined } from '@ant-design/icons';
import { monaco } from 'react-monaco-editor';
import { JMonacoEditor } from '@/components/FMonacoEditor';
import { useCallback, useEffect, useRef, useState } from 'react';
import type * as monacoEditor from 'monaco-editor';
import { Store } from 'jetlinks-store';
import { State } from '@/components/FRuleEditor';

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

interface Props {
  mode?: 'advance' | 'simple';
  onChange?: (value: 'advance' | 'simple') => void;
  id?: string;
  onValueChange?: (v: any) => void;
  value?: string;
}

const Editor = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string | undefined>(State.code);

  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor>();
  const editorDidMountHandle = (editor: monacoEditor.editor.IStandaloneCodeEditor) => {
    editor.getAction('editor.action.formatDocument').run();
    editorRef.current = editor;
  };

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleInsertCode = useCallback(
    (_value: string) => {
      const editor = editorRef.current;
      if (!editor || !_value) return;
      const position = editor.getPosition()!;
      editor?.executeEdits(value, [
        {
          range: new monaco.Range(
            position?.lineNumber,
            position?.column,
            position?.lineNumber,
            position?.column,
          ),
          text: _value,
        },
      ]);
      // Store.set('add-operator-value', undefined);
    },
    [value],
  );

  useEffect(() => {
    let subscription: any = null;
    if (props.mode === 'advance') {
      subscription = Store.subscribe('add-operator-value', handleInsertCode);
    }
    return () => subscription?.unsubscribe();
  }, [props.mode]);

  return (
    <div
      className={styles.box}
      ref={() => {
        setTimeout(() => {
          setLoading(true);
        }, 100);
      }}
    >
      <div className={styles.top}>
        <div className={styles.left}>
          {symbolList
            .filter((t, i) => i <= 3)
            .map((item) => (
              <span
                key={item.key}
                onClick={() => {
                  handleInsertCode(item.value);
                }}
              >
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
                          handleInsertCode(item.value);
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
          {props.mode !== 'advance' && (
            <span>
              <Tooltip title={!props.id ? '请先输入标识' : '设置属性规则'}>
                <FullscreenOutlined
                  className={!props.id ? styles.disabled : ''}
                  onClick={() => {
                    if (props.id) {
                      props.onChange?.('advance');
                    }
                  }}
                />
              </Tooltip>
            </span>
          )}
        </div>
      </div>
      {loading && (
        <JMonacoEditor
          editorDidMount={editorDidMountHandle}
          language={'javascript'}
          height={300}
          onChange={(c) => {
            setValue(c);
            if (props.mode !== 'advance') {
              State.code = c;
              Store.set('rule-editor-value', State.code);
            }
            props.onValueChange?.(c);
          }}
          value={value}
        />
      )}
    </div>
  );
};
export default Editor;
