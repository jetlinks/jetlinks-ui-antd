import DB from '@/db';
import type { DeviceMetadata } from '@/pages/device/Product/typings';

const EventTable = DB.getDB().table(`events`);
const PropertyTable = DB.getDB().table(`properties`);
const FunctionTable = DB.getDB().table(`functions`);
const TagTable = DB.getDB().table(`tags`);

const MetadataAction = {
  insert: (metadata: DeviceMetadata) => {
    EventTable.clear().then(() => {
      EventTable.bulkAdd(metadata.events || []);
    });
    PropertyTable.clear().then(() => {
      PropertyTable.bulkAdd(metadata.properties || []);
    });
    FunctionTable.clear().then(() => {
      FunctionTable.bulkAdd(metadata.functions || []);
    });
    TagTable.clear().then(() => {
      TagTable.bulkAdd(metadata.tags || []);
    });
  },
  clean: () => {
    EventTable.clear();
    PropertyTable.clear();
    FunctionTable.clear();
    TagTable.clear();
  },
};
export default MetadataAction;
