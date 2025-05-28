import { message } from "antd";
import { useCallback, useEffect, useState } from "react";

const useIndexedDB = (dbName: string, storeName: string, version: number) => {
  const [openLoading, setOpenLoading] = useState(false);
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    const request = indexedDB.open(dbName, version);
    request.onerror = (event) => {
      console.log("IndexedDB打开失败", event);
      setOpenLoading(false)
    };
    request.onsuccess = (event: any) => {
      console.log("IndexedDB打开成功", event.target.result);
      setDb(event.target.result);
      setOpenLoading(true);
    };
    request.onupgradeneeded = (event: any) => {
      const database = event.target.result;
      // 检查对象存储是否存在，不存在则创建
      if (!database.objectStoreNames.contains(storeName)) {
        const store = database.createObjectStore(storeName, { keyPath: 'id' });
        // 创建索引示例
        store.createIndex('name', 'name', { unique: false });
      }
    }
    return () => {
      db?.close(); // 关闭数据库连接
      console.log("IndexedDB关闭成功");
    }
  }, []);
  // 添加数据
  const addItem = useCallback(
    (item: any) => {
      console.log("添加数据", item);

      return new Promise<void>((resolve, reject) => {
        if (!db) {
          reject('Database not open');
          message.error("数据库未打开，请稍后再试！")
          return;
        }
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        const request = store.add(item);

        request.onsuccess = () => resolve();
        request.onerror = (event: any) => {
          console.log("添加数据失败1", event);
          reject(event.target.error)
        };
      });
    },
    [db, storeName, version]
  );
  // 获取所有数据
  const getAllItems = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject('Database not initialized');
        return;
      }

      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event: any) => reject(event.target.error);
    });
  }, [db, storeName]);


  return { openLoading, addItem, getAllItems }
};
export default useIndexedDB;