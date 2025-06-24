import React, { useState, useRef, useEffect } from 'react';
import styles from './index.module.less';
import { useRequest } from 'ahooks';
import { fetchDeviceList } from './service'; // 导入 fetchDeviceList

// 定义设备数据类型，与 service.ts 中的 DeviceType 保持一致
interface DeviceType {
  id: string;
  name: string;
  ip: string;
  // 根据实际接口返回的设备数据结构定义更多字段
}

function index() {
  const [isSharing, setIsSharing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // 使用 useRequest 调用 fetchDeviceList 函数获取设备列表
  const { data: devices, error, loading } = useRequest<DeviceType[], []>(fetchDeviceList);

  // 当设备列表数据加载完成后，更新 deviceList 状态，并可以选择第一个设备作为默认选中项
  useEffect(() => {
    if (devices && devices.length > 0) {
      if (!selectedDevice) {
        setSelectedDevice(devices[0].id); // 假设 id 是唯一的标识符
      }
    }
  }, [devices, selectedDevice]);

  if (loading) {
    return <div className={styles.loadingContainer}><p>正在加载设备列表...</p></div>;
  }

  if (error) {
    return <div className={styles.errorContainer}><p>加载设备列表失败: {error.message}</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>浏览器投屏控制台</h1>
        <div className={styles.connectionStatus}>
          {isConnected ? (
            <span className={styles.connected}>已连接</span>
          ) : (
            <span className={styles.disconnected}>未连接</span>
          )}
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.controlPanel}>
          <div className={styles.section}>
            <h2>设备连接</h2>
            <div className={styles.deviceList}>
              <select 
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className={styles.deviceSelect}
              >
                <option value="">选择设备</option>
                {devices?.map(device => (
                  <option key={device.id} value={device.id}>{device.name} ({device.ip})</option>
                ))}
              </select>
              <button className={styles.connectBtn}>
                连接设备
              </button>
            </div>
          </div>

          <div className={styles.section}>
            <h2>房间管理</h2>
            <div className={styles.roomControls}>
              <input
                type="text"
                placeholder="输入房间ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className={styles.roomInput}
              />
              <div className={styles.roomButtons}>
                <button className={styles.createBtn}>创建房间</button>
                <button className={styles.joinBtn}>加入房间</button>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>投屏控制</h2>
            <div className={styles.sharingControls}>
              <button 
                className={`${styles.shareBtn} ${isSharing ? styles.active : ''}`}
                onClick={() => setIsSharing(!isSharing)}
              >
                {isSharing ? '停止共享' : '开始共享'}
              </button>
              <div className={styles.qualitySettings}>
                <label>画质设置：</label>
                <select className={styles.qualitySelect}>
                  <option value="high">高清</option>
                  <option value="medium">标清</option>
                  <option value="low">流畅</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.previewPanel}>
          <div className={styles.videoContainer}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={styles.video}
            />
            {!isSharing && (
              <div className={styles.placeholder}>
                等待开始共享...
              </div>
            )}
          </div>
          <div className={styles.previewControls}>
            <button className={styles.controlBtn}>
              <span className={styles.icon}>🔊</span>
              音频
            </button>
            <button className={styles.controlBtn}>
              <span className={styles.icon}>🎥</span>
              摄像头
            </button>
            <button className={styles.controlBtn}>
              <span className={styles.icon}>⚙️</span>
              设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default index;