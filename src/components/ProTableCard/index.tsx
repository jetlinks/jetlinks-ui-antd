import type { ProTableProps } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { ParamsType } from '@ant-design/pro-provider';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { isFunction } from 'lodash';
import { Empty, Pagination, Space } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import LoadingComponent from '@ant-design/pro-layout/es/PageLoading';
import './index.less';
import { useDomFullHeight } from '@/hooks';

enum ModelEnum {
  TABLE = 'TABLE',
  CARD = 'CARD',
}

const Default_Size = 6;

type ModelType = keyof typeof ModelEnum;

interface ProTableCardProps<T> {
  cardRender?: (data: T) => JSX.Element | React.ReactNode;
  gridColumn?: number;
  height?: 'none';
}

const ProTableCard = <
  T extends Record<string, any>,
  U extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: ProTableCardProps<T> & ProTableProps<T, U, ValueType>,
) => {
  const { cardRender, toolBarRender, request, ...extraProps } = props;
  const [model, setModel] = useState<ModelType>(ModelEnum.CARD);
  const [total, setTotal] = useState<number | undefined>(0);
  const [current, setCurrent] = useState(1); // 当前页
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(Default_Size * 2); // 每页条数
  const [column, setColumn] = useState(props.gridColumn || 4);
  const [loading, setLoading] = useState(false);
  const [dataLength, setDataLength] = useState<number>(0);

  const domRef = useRef<HTMLDivElement>(null);
  const { minHeight } = useDomFullHeight(domRef);

  /**
   * 处理 Card
   * @param dataSource
   */
  const handleCard = useCallback(
    (dataSource: readonly T[] | undefined, rowSelection?: any): JSX.Element => {
      setDataLength(dataSource ? dataSource.length : 0);

      const Item = (dom: React.ReactNode) => {
        if (!rowSelection || (rowSelection && !rowSelection.selectedRowKeys)) {
          return dom;
        }
        const { selectedRowKeys, onChange } = rowSelection;

        // @ts-ignore
        const id = dom.props.id;

        // @ts-ignore
        return React.cloneElement(dom, {
          // @ts-ignore
          className: classNames(dom.props.className, {
            'item-active': selectedRowKeys && selectedRowKeys.includes(id),
          }),
          key: id,
          onClick: (e) => {
            e.stopPropagation();
            if (onChange) {
              const isSelect = selectedRowKeys.includes(id);

              if (isSelect) {
                const nowRowKeys = selectedRowKeys.filter((key: string) => key !== id);
                onChange(
                  nowRowKeys,
                  dataSource!.filter((item) => nowRowKeys.includes(item.id)),
                );
              } else {
                const nowRowKeys = [...selectedRowKeys, id];
                onChange(
                  nowRowKeys,
                  dataSource!.filter((item) => nowRowKeys.includes(item.id)),
                );
              }
            }
          },
        });
      };

      return (
        <>
          {dataSource && dataSource.length ? (
            <div
              className={'pro-table-card-items'}
              style={{ gridTemplateColumns: `repeat(${column}, 1fr)` }}
            >
              {dataSource.map((item) =>
                cardRender && isFunction(cardRender) ? Item(cardRender(item)) : null,
              )}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: props.height === 'none' ? 'auto' : minHeight - 150,
              }}
            >
              <Empty />
            </div>
          )}
        </>
      );
    },
    [minHeight],
  );

  const windowChange = () => {
    if (window.innerWidth <= 1440) {
      setColumn(props.gridColumn && props.gridColumn < 2 ? props.gridColumn : 2);
    } else if (window.innerWidth > 1440 && window.innerWidth <= 1600) {
      setColumn(props.gridColumn && props.gridColumn < 3 ? props.gridColumn : 3);
    } else if (window.innerWidth > 1600) {
      setColumn(props.gridColumn && props.gridColumn < 4 ? props.gridColumn : 4);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', windowChange);
    windowChange();
    return () => {
      window.removeEventListener('resize', windowChange);
    };
  }, []);

  const pageSizeOptions = [Default_Size * 2, Default_Size * 4, Default_Size * 8, Default_Size * 16];

  useEffect(() => {
    setCurrent(1);
    setPageIndex(0);
  }, [props.params]);

  return (
    <div
      className={'pro-table-card'}
      style={{ minHeight: props.height === 'none' ? 'auto' : minHeight }}
      ref={domRef}
    >
      <ProTable<T, U, ValueType>
        {...extraProps}
        params={
          {
            ...props.params,
            current: current,
            pageIndex: pageIndex,
            pageSize,
          } as any
        }
        className={'pro-table-card-body'}
        options={model === ModelEnum.CARD ? false : props.options}
        request={async (param, sort, filter) => {
          if (request) {
            const resp = await request(param, sort, filter);
            setLoading(false);
            setTotal(resp.result ? resp.result.total : 0);
            return {
              code: resp.message,
              result: {
                data: resp.result ? resp.result.data : [],
                pageIndex: resp.result ? resp.result.pageIndex : 0,
                pageSize: resp.result ? resp.result.pageSize : 0,
                total: resp.result ? resp.result.total : 0,
              },
              status: resp.status,
            };
          }
          return {};
        }}
        onLoadingChange={(l) => {
          setLoading(!!l);
        }}
        pagination={{
          onChange: (page, size) => {
            setCurrent(page);
            setPageIndex(page - 1);
            setPageSize(size);
          },
          pageSize: pageSize,
          current: current,
          pageSizeOptions: pageSizeOptions,
        }}
        toolBarRender={(action, row) => {
          const oldBar = toolBarRender ? toolBarRender(action, row) : [];
          return [
            ...oldBar,
            <Space
              align="center"
              key={ModelEnum.TABLE}
              size={12}
              className={classNames(`pro-table-card-setting-item`, {
                active: model === ModelEnum.TABLE,
              })}
              onClick={() => {
                setModel(ModelEnum.TABLE);
              }}
            >
              <BarsOutlined />
            </Space>,
            <Space
              align="center"
              size={12}
              key={ModelEnum.CARD}
              className={classNames(`pro-table-card-setting-item`, {
                active: model === ModelEnum.CARD,
              })}
              onClick={() => {
                setModel(ModelEnum.CARD);
              }}
            >
              <AppstoreOutlined />
            </Space>,
          ];
        }}
        tableViewRender={
          model === ModelEnum.CARD
            ? (tableProps) => {
                return handleCard(tableProps.dataSource, extraProps?.rowSelection);
              }
            : undefined
        }
      />
      {model === ModelEnum.CARD && (
        <>
          <div className={classNames('mask-loading', { show: loading })}>
            <LoadingComponent />
          </div>
          {!!dataLength && (
            <Pagination
              showSizeChanger
              size="small"
              className={'pro-table-card-pagination'}
              total={total}
              current={current}
              onChange={(page, size) => {
                setCurrent(page);
                setPageIndex(page - 1);
                setPageSize(size);
              }}
              pageSizeOptions={pageSizeOptions}
              pageSize={pageSize}
              showTotal={(num) => {
                const minSize = pageIndex * pageSize + 1;
                const MaxSize = (pageIndex + 1) * pageSize;
                return `第 ${minSize} - ${MaxSize > num ? num : MaxSize} 条/总共 ${num} 条`;
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProTableCard;
