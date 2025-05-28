import { useEffect, useState } from 'react';
import './index.less'
const index = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!window.AMap) {
      const script = document.createElement('script');
      script.src = `https://webapi.amap.com/maps?v=2.0&key=bbce5d91dbb2ef88f9287e7b834e5ce2`;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);
  useEffect(() => {
    if (mapLoaded) {
      const map = new window.AMap.Map('map-body', {
        zoom: 15,
        center: [116.397428, 39.90923],
      });

      new window.AMap.Marker({
        position: [116.397428, 39.90923],
        map: map
      });
    }
  }, [mapLoaded]);
  return (
    <div className="map-container" id="map-body">
    </div>
  );
}
export default index;