import { get } from "../../utils/request"; // 从 utils 导入 request 服务


/**
 * @description 获取投屏设备列表
 * @param params 可选参数，根据接口需求传递
 * @returns Promise<DeviceType[]> 返回设备列表的 Promise
 */
export const fetchDeviceList = (params?: any) => {
    // 调用 request 服务的 get 方法，指定返回数据类型为 DeviceType[]
    return get('/device/discover', { params }).then((res: any) => {
        console.log('获取设备列表成功:', res.data);
        return res.data;
    });
};