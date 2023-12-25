import {DBConfig} from "ngx-indexed-db";

export const dbConfig: DBConfig = {
  name: 'SignalsDB',
  version: 1,
  objectStoresMeta: [{
    store: 'signals',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'id', keypath: 'id', options: { unique: true } },
      { name: 'timestamp', keypath: 'timestamp', options: { unique: false } },
      { name: 'frequency', keypath: 'frequency', options: { unique: false } },
      { name: 'point', keypath: 'point', options: { unique: false } },
      { name: 'zone', keypath: 'zone', options: { unique: false } },
    ]
  }]
};
