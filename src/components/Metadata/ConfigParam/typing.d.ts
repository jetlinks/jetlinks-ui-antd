type MetadataConfig = {
  name: string;
  description: string;
  scopes: string[];
  properties: {
    property: string;
    name: string;
    scopes: [];
    type: {
      elements: {
        value: string;
        text: string;
        description: string;
      }[];
      multi: boolean;
      name: string;
      id: string;
      type: string;
    };
  }[];
};
