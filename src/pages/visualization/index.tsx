import React, { useState } from "react"
import { Rnd } from 'react-rnd';
import styles from './index.less';
interface Props { }
const Visualization: React.FC<Props> = (props) => {
    const [rnds, setRnds] = useState([0, 1, 2].map(i => ({
        width: 200,
        height: 200,
        x: i * 100,
        y: i * 100,
    })));
    return (
        <>
            {[0, 1, 2].map(i => (
                <Rnd
                    key={`rnd${i}`}
                    className={styles.rndDemo}
                    size={{
                        width: rnds[i].width,
                        height: rnds[i].height,
                    }}
                    position={{
                        x: rnds[i].x,
                        y: rnds[i].y,
                    }}
                    onDragStop={(e, d) => {
                        const rnds1 = [...rnds];
                        rnds1[i] = { ...rnds[i], x: d.x, y: d.y };
                        setRnds(rnds1);
                    }}
                    onResize={(e, direction, ref, delta, position) => {
                        const rnds1 = [...rnds];
                        rnds1[i] = {
                            ...rnds[i],
                            width: ref.offsetWidth,
                            height: ref.offsetHeight,
                            ...position,
                        };
                        setRnds(rnds1)
                    }}
                >
                    00{i}
                </Rnd>
            ))}
        </>
    )
}
export default Visualization