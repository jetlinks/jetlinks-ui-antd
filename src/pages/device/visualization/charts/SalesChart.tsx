import React, { useState, useEffect } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import { Button, message, Drawer, Form } from 'antd';
import { ComponentProps } from '..';

interface Props extends ComponentProps {
    config: {
        title: string,
        data: object,
        cols: object
    }
}

const SalesCharts = (props: Props) => {

    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [config] = useState(props.config && props.config.data ? props.config :
        {
            title: '柱形图',
            data: [
                { genre: 'Sports', sold: 275, income: 2300 },
                { genre: 'Strategy', sold: 115, income: 667 },
                { genre: 'Action', sold: 120, income: 982 },
                { genre: 'Shooter', sold: 350, income: 5271 },
                { genre: 'Other', sold: 150, income: 3710 }
            ],
            cols: {
                sold: { alias: '销售量' },
                genre: { alias: '游戏种类' }
            }
        });

    const [height, setHeight] = useState<number>(300);

    useEffect(() => {
        const div = document.getElementById(props.id);
        if (div) {
            setHeight(div.offsetHeight - 50);
        }
    }, [props.ySize]);
    useEffect(() => {
        if (props.ready) {
            props.ready(() => {
                message.success(`更新。。。${props.id}`);
            });
        }
        if (props.edit) {
            props.edit(() => {
                setEditVisible(true);
            });
        }
        if (props.preview) {
            props.preview(() => 'https://www.baidu.com/link?url=kuSzeluGn9dkOqcDvPcvU5g1gh-DMms6auTTUACJkdPm559tFM6GRDYkHE7p8fSHDl-RSOc5KeDGQBCictIOZsdgBL5Ds_kDaZCu1qgx99BitlSq6ocOJp3htq0bW7IoATv4Y0I33tKGyQL-bBDOuAqHvqsLeQiWlDuR0KCJiA3u-SswRJhJQHgREuKPOHszUZ0L_9oieMXOwCY0HYUDGsIKBjIMNoV3x6CFP4h63kPC3rmMwKTs-0WtEa1VceLscigtzPQiQmqZqlctYr1JX1IWLbR6r6rNcvQvP2o8NqaHqfzcG0tTiE6y7fSgM9D2N1E9ON8yyBf8iRnPOIzjfc6p2FPMmuM6_Rc6cBFhhPC_ujQWj4kc_CveBLiapyLMDS4E1KVznYHYWSz_OiK-DZIvGqriXnBUCz5j25CgJFm_mMK-LrwLAXkHY_2BzRr4WQFBMoOzesktllvUaOmzlkircgLMGRVKQZRubOzkJ0ocCySDlUKSyNeIX01yGRGGOZ5EEBoPD6BVVUFCKKUUEEp6NEj-6vVN_Jihgk-_W1J--9a9PKRuXKuS0EbKjvySdY3f5ink5eax6jvSvv7GNywDh1E6slJqj8rHTBQO32niX9mPlD9vfLrbOxSUcTBO_GUmwK6K7OIZSCUChT3Lpuwv38Lr8vlFbuUdZIB2tSO1lDLjDshWgPlic54ECPb4TLsGMdlJg8p8q_BLL4Qdly75nte91d1jYcb3EbEbFViLVewOfeOspKTyimZFT-G0Qe15r1klAAZvt7dD5LBqu_Nh89uLs4_ZZ4jhQJKBSLm&timg=&click_t=1587465382772&s_info=1622_978&wd=&eqid=e5c3ddcc00000e74000000065e9ecca5')
        }

    }, [])
    return (
        <div>
            <Chart height={height} data={config.data} scale={config.cols} forceFit>
                <Axis name="genre" title />
                <Axis name="sold" title />
                <Legend position="top" />
                <Tooltip />
                <Geom type="interval" position="genre*sold" color="genre" />
            </Chart>
            {editVisible &&
                <Drawer
                    title="编辑"
                    visible
                    onClose={() => {
                        setEditVisible(false)
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #e9e9e9',
                            padding: '10px 16px',
                            background: '#fff',
                            textAlign: 'right',
                        }}
                    >

                        <Form.Item>
                            <Button
                                style={{ marginRight: 8 }}
                            >
                                关闭
                        </Button>
                            <Button
                                onClick={() => {
                                    // updateCard()
                                }}
                                htmlType="submit"
                                type="primary"
                            >
                                保存
                        </Button>
                        </Form.Item>

                    </div>
                </Drawer>
            }
        </div>
    );
}

export default SalesCharts;