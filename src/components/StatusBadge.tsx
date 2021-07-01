import React, { useEffect, useState } from 'react';
import { Badge } from 'antd';

interface StatusBadgeProps {
  value?: string
  onLine?: string
  style?: React.CSSProperties
  textColor?: string
}

function StatusBadge(props: StatusBadgeProps) {
  const [status, setStatus] = useState({
    online: ['#87d068', '在线'],
    offline: ['#f50', '离线']
  })

  useEffect(() => {
    if (props.onLine) {
      let _status = status
      _status[props.onLine] = status.online
      setStatus(_status)
    }
  }, [props.onLine])

  return (
    <Badge
      color={status[props.value || 'online'][0]}
      text={<span style={props.textColor ? { color: props.textColor } : {}}>{status[props.value || 'online'][1]}</span>}
      style={props.style}
    />
  );
}

export default StatusBadge;
