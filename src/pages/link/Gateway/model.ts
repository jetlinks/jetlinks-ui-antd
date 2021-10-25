import { model } from '@formily/reactive';

type GatewayModelType = {
  provider: { label: string; value: string }[];
};
const GatewayModel = model<GatewayModelType>({
  provider: [],
});

export default GatewayModel;
