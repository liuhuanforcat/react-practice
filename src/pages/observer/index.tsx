import { Button, Card, Space } from 'antd';
import React, { useState } from 'react';
import useStockSubject from '../../hooks/useStockSubject';
import CardDec from './CardDec';
function index() {
  const stockSubject = useStockSubject(100)
  const [isObserver, setIsObserver] = useState(false);
  const handleRandomPrice = () => {
    const newPrice = Math.floor(Math.random() * 50) + 80; // 80~130随机价格
    stockSubject.changePrice(newPrice);
  };

  return <div>
    <CardDec subject={stockSubject} isObserver={isObserver} />
    <Space size={4}>
      <Button type="primary" onClick={handleRandomPrice}>改变价格</Button>
      <Button onClick={() => setIsObserver(!isObserver)}> {isObserver ? '取消订阅' : '开始订阅'} </Button>
    </Space>

  </div>;
}
export default index;