import Dexie from 'dexie';
import SystemConst from '@/utils/const';

class DexieDB {
  public db: Dexie;

  constructor() {
    this.db = new Dexie(SystemConst.API_BASE);
    // 第一版本考虑动态创建表。但开关数据库造成数据库状态错误。
    // 所以改为初始化就创建系统所需要的表。
    this.db.version(1).stores({
      permission: 'id,name,status,describe,type',
      events: 'id,name',
      properties: 'id,name',
      functions: 'id,name',
      tags: 'id,name',
    });
  }

  getDB() {
    if (this.db && this.db?.verno === 0) {
      // 考虑优化
      // 获取不到真实的数据库版本
      // 所以当获取到的数据库版本号为0则删除数据库重新初始化
      this.db.delete();
      this.db = new Dexie(SystemConst.API_BASE);
      this.db.version(1);
      return this.db;
    }
    return this.db;
  }

  /**
   * 会造成数据库状态错误
   * @deprecated
   * @param extendedSchema
   */
  updateSchema = async (extendedSchema: Record<string, string | null>) => {
    await this.getDB().close();
    await this.getDB()
      .version(this.db.verno + 1)
      .stores(extendedSchema);
    return this.getDB().open();
  };
}

const DB = new DexieDB();
export default DB;
