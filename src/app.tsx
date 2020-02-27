import { message } from 'antd';

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      message.error(err.message);
    },
  },
};

// export function onRouteChange({ location }: { location: Location }) {
//     location.query = qs.parse(qs.stringify(location.query), { plainObjects: true });
//     location.state = {
//         ...location.state || {}
//     }
// }
