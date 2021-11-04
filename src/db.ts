import Dexie from 'dexie';
import SystemConst from '@/utils/const';

class DexieDB {
  public db: Dexie;

  constructor() {
    this.db = new Dexie(SystemConst.API_BASE);
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

  updateSchema = async (extendedSchema: Record<string, string | null>) => {
    // 打开后才能获取正确的版本号
    // console.log(database)
    await this.getDB().close();
    // 关闭后才可以更改表结构
    await this.getDB()
      .version(this.db.verno + 1)
      .stores(extendedSchema);
    return this.getDB().open();
  };
}

const DB = new DexieDB();
export default DB;
