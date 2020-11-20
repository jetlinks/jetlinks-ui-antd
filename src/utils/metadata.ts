interface BaseMetadata {
    id: string;
    name: string;
    description: string;
    expands: any;
}

interface Event extends BaseMetadata {

    valueType: {
        type: string;
        properties: {
            id: string,
            name: string,
            valueType: {
                type: string;
                format?: string;
            }
        }[]
    };
}
interface Property extends BaseMetadata {

    valueType: {
        type: string;
        expands: {
            maxLength: string;
        }
    },

    description: string;
}
interface Functions extends BaseMetadata {

}
interface Metadata {

    getEvents: Event[];
    getProperties: Property[];
    getFunctions: Functions[];
    getTags: Property[];

}

class MetadataParse implements Metadata {
    getEvents: Event[] = [];
    getProperties: Property[] = [];
    getFunctions: Functions[] = [];
    getTags: Property[] = [];

}


