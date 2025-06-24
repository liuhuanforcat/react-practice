import React, { useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';

// 这里建议后续引入 simple-peer 库和信令服务器相关代码
// import Peer from 'simple-peer';

const SIGNAL_SERVER_URL = 'localhost'; // PeerJS 默认端口 9000

const ScreenShareDemo: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [peerId, setPeerId] = useState('');
  const peerRef = useRef<Peer | null>(null);
  const callRef = useRef<MediaConnection | null>(null);

  // const SimplePeer = Peer.default || Peer;

  // console.log('SimplePeer:', SimplePeer); // 应该是 function

  // 创建 Peer
  const createPeer = async (id?: string) => {
    const peer = id ? new Peer(id, { host: 'localhost', port: 9000, path: '/' }) : new Peer({ host: 'localhost', port: 9000, path: '/' });
    peer.on('open', (id) => {
      setPeerId(id);
      setJoined(true);
      console.log('PeerJS open, id:', id);
    });
    peer.on('error', (err) => {
      alert('PeerJS 错误: ' + err);
    });
    peerRef.current = peer;

    // 采集屏幕流
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    // 等待观众 call
    peer.on('call', (call) => {
      console.log('收到观众 call，推送流:', stream);
      console.log('推送流的视频轨道:', stream.getVideoTracks());
      console.log('推送流的音频轨道:', stream.getAudioTracks());
      call.answer(stream); // 把屏幕流推给观众
    });

    return peer;
  };

  // 创建房间（发起者）
  const handleCreate = async () => {
    if (!roomId) return;
    const peer = await createPeer(roomId);
  };

  // 加入房间（接收者）
  const handleJoin = async () => {
    if (!roomId) return;
    const peer = await createPeer(); // 自动分配 id

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(emptyStream => {
      const call = peer.call(roomId, emptyStream);
      if (!call) {
        alert('房主未在线或房间号错误');
        return;
      }
      call.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          console.log('✅ 已获取到远端流:', remoteStream);
          console.log('视频轨道:', remoteStream.getVideoTracks());
          console.log('音频轨道:', remoteStream.getAudioTracks());
        }
      });
    });
  };

  // 开始投屏（发起者）
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      // 发起者主动呼叫所有观众（需要知道观众的 peerId）
      // 这里可以让观众输入房主 peerId 后主动 call
    } catch (err) {
      alert('获取屏幕流失败：' + (err as any).message);
    }
  };

  // 发起者主动呼叫观众（可选，通常是观众 call 房主）
  const callPeer = async (targetId: string) => {
    if (!peerRef.current) return;
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (!stream) return alert('请先开始投屏');
    const call = peerRef.current.call(targetId, stream);
    call.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        console.log('✅ 已获取到远端流:', remoteStream);
      }
    });
    callRef.current = call;
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>PeerJS 投屏 Demo</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="房间号"
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
          disabled={joined}
        />
        <button onClick={handleCreate} disabled={joined || !roomId}>创建房间</button>
        <button onClick={handleJoin} disabled={joined || !roomId}>加入房间</button>
        <button onClick={startScreenShare}>开始投屏</button>
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <div>
          <div>本地投屏画面</div>
          <video ref={localVideoRef} autoPlay playsInline muted width={320} height={240} style={{ background: '#000' }} />
        </div>
        <div>
          <div>远端接收画面</div>
          <video ref={remoteVideoRef} autoPlay playsInline width={320} height={240} style={{ background: '#000' }} />
        </div>
      </div>
      <div style={{ marginTop: 24, color: '#888' }}>
        <p>本页面演示 PeerJS 投屏流程。<br />需要本地启动 peerjs-server：<br />npx peerjs --port 9000</p>
        <ul>
          <li>点击"开始投屏"将采集本地屏幕并显示在左侧。</li>
          <li>实际投屏需将屏幕流通过 PeerJS 发送给远端。</li>
          <li>远端收到流后显示在右侧。</li>
        </ul>
      </div>
    </div>
  );
};

export default ScreenShareDemo;