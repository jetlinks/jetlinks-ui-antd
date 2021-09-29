type PermissionItem = {
  id: string;
  name: string;
  describe: string;
  status: number;
  actions: {
    action: string;
    name: string;
    properties: Record<string, unknown>;
    [name: string]: unknown;
  }[];
  optionalFields: {
    name: string;
    describe: string;
  }[];
  properties: Record<string, unknown>;
};

type AuthorizationItem = {
  actions: string[];
  id: string;
  dataAccesses: string[];
  dimensionTarget: string;
  dimensionTargetName: string;
  dimensionType: string;
  dimensionTypeName: string;
  merge: boolean;
  permission: string;
  priority: number;
  state: number;
};

interface AuthorizationProps {
  target: {
    id: string;
    name: string;
    type: string;
  };
  close: () => void;
}
