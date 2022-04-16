export default {
  namespace: 'location',
  state: {
    locationState: {},
    path: '',
  },
  reducers: {
    push(s: any, payload: any) {
      return payload.payload;
    },
    cleanLocationState() {
      return {
        locationState: {},
        path: '',
      };
    },
  },
};
