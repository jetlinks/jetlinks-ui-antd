import Dexie from 'dexie';

const db = new Dexie('permission');

db.version(3).stores({
  permission: 'id,name,status,describe,type',
});

export default db;
