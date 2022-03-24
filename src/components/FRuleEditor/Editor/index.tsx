import styles from '@/components/FRuleEditor/index.less';
import { Dropdown, Menu } from 'antd';
import { FullscreenOutlined, MoreOutlined } from '@ant-design/icons';
import MonacoEditor, { monaco } from 'react-monaco-editor';
import { useEffect, useRef } from 'react';
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
}

const Editor = (props: Props) => {
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor>();
  const editorDidMountHandle = (editor: monacoEditor.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const handleInsertCode = (value: string) => {
    console.log(value, 'values');
    const editor = editorRef.current;
    if (!editor || !value) return;
    const position = editor.getPosition()!;
    editor?.executeEdits(State.code, [
      {
        range: new monaco.Range(
          position?.lineNumber,
          position?.column,
          position?.lineNumber,
          position?.column,
        ),
        text: value,
      },
    ]);
  };

  useEffect(() => {
    const subscription = Store.subscribe('add-operator-value', handleInsertCode);
    return () => subscription.unsubscribe();
  }, [props.mode]);

  useEffect(() => {
    Store.set('add-operator-value', undefined);
  }, []);
  return (
    <div className={styles.box}>
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
              <FullscreenOutlined onClick={() => props.onChange?.('advance')} />
            </span>
          )}
        </div>
      </div>
      <MonacoEditor
        editorDidMount={(editor) => editorDidMountHandle(editor)}
        language={'javascript'}
        height={300}
        onChange={(c) => {
          State.code = c;
          Store.set('rule-editor-value', State.code);
        }}
        value={State.code}
      />
    </div>
  );
};
export default Editor;
