import type { ProTableProps } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { ParamsType } from '@ant-design/pro-provider';
import React, { Key, useCallback, useEffect, useRef, useState } from 'react';
import { isFunction } from 'lodash';
import { Pagination, Space } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import LoadingComponent from '@ant-design/pro-layout/es/PageLoading';
import './index.less';
import { useDomFullHeight } from '@/hooks';
import { Empty } from '@/components';

enum ModelEnum {
  TABLE = 'TABLE',
  CARD = 'CARD',
}

const Default_Size = 6;

type ModelType = keyof typeof ModelEnum;

interface ProTableCardProps<T> {
  cardRender?: (data: T) => JSX.Element | React.ReactNode;
  gridColumn?: number;
  /**
   * 用于不同分辨率
   * gridColumns[0] 1366 ~ 1440 分辨率；
   * gridColumns[1] 1440 ~  1600 分辨率；
   * gridColumns[2] > 1600 分辨率；
   */
  gridColumns?: [number, number, number];
  height?: 'none';
  onlyCard?: boolean; //只展示card
  onPageChange?: (page: number, size: number) => void;
  cardBodyClass?: string;
  noPadding?: boolean;
  cardScrollY?: number;
  modelChange?: (type: ModelType) => void;
}

const ProTableCard = <
  T extends Record<string, any>,
  U extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: ProTableCardProps<T> & ProTableProps<T, U, ValueType>,
) => {
  const { cardRender, toolBarRender, request, onlyCard, ...extraProps } = props;
  const [model, setModel] = useState<ModelType>(ModelEnum.CARD);
  const [total, setTotal] = useState<number | undefined>(0);
  const [current, setCurrent] = useState(
    props.params && props.params.pageIndex ? props.params.pageIndex + 1 : 1,
  ); // 当前页
  const [pageIndex, setPageIndex] = useState(
    props.params && props.params.pageIndex ? props.params.pageIndex : 0,
  );
  const [pageSize, setPageSize] = useState(
    props.params && props.params.pageSize ? props.params.pageSize : Default_Size * 2,
  ); // 每页条数
  const [column, setColumn] = useState(props.gridColumn || 4);
  const [loading, setLoading] = useState(false);
  const [dataLength, setDataLength] = useState<number>(0);

  const domRef = useRef<HTMLDivElement>(null);
  const cardItemsRef = useRef<HTMLDivElement>(null);
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
        const { selectedRowKeys, onChange, onSelect, type } = rowSelection;

        // @ts-ignore
        const id = dom.props.id;

        // @ts-ignore
        return React.cloneElement(dom, {
          // @ts-ignore
          className: classNames(dom.props.className, {
            'item-active': selectedRowKeys && selectedRowKeys.includes(id),
          }),
          key: id,
          onClick: (e: any) => {
            console.log(e);
            e.stopPropagation();
            if (onChange || onSelect) {
              const isSelect = selectedRowKeys.includes(id);

              let nowRowKeys: Key[] = [];
              let nowRowNodes = [];
              if (isSelect) {
                nowRowKeys =
                  type === 'radio' ? [id] : selectedRowKeys.filter((key: string) => key !== id);
              } else {
                // const nowRowKeys = [...selectedRowKeys, id];
                nowRowKeys = rowSelection.type === 'radio' ? [id] : [...selectedRowKeys, id];
              }
              nowRowNodes = dataSource!.filter((item) => nowRowKeys.includes(item.id));

              onChange?.(nowRowKeys, nowRowNodes);
              onSelect?.((dom as any).props, !isSelect, nowRowNodes);
            }
          },
        });
      };

      const style: React.CSSProperties = {};

      if (props.cardScrollY !== undefined) {
        style.maxHeight = props.cardScrollY;
        style.overflowY = 'auto';
      }

      return (
        <>
          {dataSource && dataSource.length ? (
            <div style={{ paddingBottom: 38 }}>
              <div
                className={classNames('pro-table-card-items', props.cardBodyClass)}
                ref={cardItemsRef}
                style={{ gridTemplateColumns: `repeat(${column}, 1fr)`, ...style }}
              >
                {dataSource.map((item) =>
                  cardRender && isFunction(cardRender) ? Item(cardRender(item)) : null,
                )}
              </div>
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
      const _column = props.gridColumn && props.gridColumn < 2 ? props.gridColumn : 2;
      setColumn(props.gridColumns ? props.gridColumns[0] : _column);
    } else if (window.innerWidth > 1440 && window.innerWidth <= 1600) {
      const _column = props.gridColumn && props.gridColumn < 3 ? props.gridColumn : 3;
      setColumn(props.gridColumns ? props.gridColumns[1] : _column);
    } else if (window.innerWidth > 1600) {
      const _column = props.gridColumn && props.gridColumn < 4 ? props.gridColumn : 4;
      setColumn(props.gridColumns ? props.gridColumns[2] : _column);
    }
  };

  const pageChange = (page: number, size: number) => {
    let _current = page;
    if (pageSize !== size) {
      _current = 1;
    }
    setCurrent(_current);
    setPageIndex(_current - 1);
    setPageSize(size);
    props.onPageChange?.(_current - 1, size);
    if (cardItemsRef.current) {
      cardItemsRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    window.addEventListener('resize', windowChange);
    windowChange();
    return () => {
      window.removeEventListener('resize', windowChange);
    };
  }, [props.gridColumns]);

  const pageSizeOptions = [Default_Size * 2, Default_Size * 4, Default_Size * 8, Default_Size * 16];

  useEffect(() => {
    if (props.params?.pageIndex) {
      setCurrent(props.params?.pageIndex + 1);
      setPageIndex(props.params?.pageIndex);
      if (props.params.pageSize) {
        setPageSize(props.params?.pageSize);
      }
    } else {
      setCurrent(1);
      setPageIndex(0);
    }
  }, [props.params]);

  return (
    <div
      className={classNames('pro-table-card', {
        noPadding: props.noPadding || 'noPadding' in props,
      })}
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
        columnEmptyText={''}
        className={'pro-table-card-body'}
        options={model === ModelEnum.CARD ? false : { ...props.options, fullScreen: false }}
        request={async (param, sort, filter) => {
          if (request) {
            delete param.total; //不传总数，不传则需要后端重新更新
            let resp = await request(param, sort, filter);
            if (resp.result.data.length === 0 && resp.result.pageIndex > 0) {
              const newParam = {
                ...param,
                current: param.current - 1,
                pageIndex: param.pageIndex - 1,
              };
              pageChange(newParam.current, newParam.pageSize);
              resp = await request(newParam, sort, filter);
            }
            setLoading(false);
            const result = {
              data: resp.result ? resp.result.data : [],
              pageIndex: resp.result ? resp.result.pageIndex : 0,
              pageSize: resp.result ? resp.result.pageSize : 0,
              total: resp.result ? resp.result.total : 0,
            };
            setTotal(result.total);
            return {
              code: resp.message,
              result,
              status: resp.status,
            };
          }
          return {};
        }}
        onLoadingChange={(l) => {
          setLoading(!!l);
        }}
        pagination={{
          onChange: pageChange,
          pageSize: pageSize,
          current: current,
          pageSizeOptions: pageSizeOptions,
        }}
        toolBarRender={(action, row) => {
          if (onlyCard) return [];
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
                props.modelChange?.(ModelEnum.TABLE);
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
                props.modelChange?.(ModelEnum.CARD);
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
              onChange={pageChange}
              pageSizeOptions={pageSizeOptions}
              pageSize={pageSize}
              showTotal={(num) => {
                const MaxSize = (pageIndex + 1) * pageSize;
                const max = MaxSize > num ? num : MaxSize;

                const minSize = pageIndex * pageSize + 1;
                const pageIndexInt =
                  parseInt(num / pageSize) === num / pageSize
                    ? num / pageSize - 1
                    : parseInt(num / pageSize);
                const min = minSize > num ? pageIndexInt * pageSize + 1 : minSize;
                if (min === 1) pageChange(min, pageSize);
                return `第 ${min} - ${max} 条/总共 ${num} 条`;
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProTableCard;
