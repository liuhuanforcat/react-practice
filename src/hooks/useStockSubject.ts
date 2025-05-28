import { useState } from "react";
type Observer = (price: number) => void;
//观察者模式  场景：一个股票价格变化通知系统（当股票价格更新时，所有订阅的组件自动刷新）
const useStockSubject = (initialPrice: number) => {
  //股票价格
  const [price, setPrice] = useState(initialPrice);

  //观察者列表
  const [observers, setObservers] = useState<Observer[]>([]);
  // 订阅事件
  const subscribe = (observer: Observer) => {
    console.log("订阅事件");
    setObservers((prevObservers) => [...prevObservers, observer]);
    return () => unsubscribe(observer); // 返回取消订阅函数
  };

  // 取消订阅事件
  const unsubscribe = (observer: Observer) => {
    console.log("取消订阅事件");
    setObservers((prevObservers) => prevObservers.filter((obs) => obs !== observer));
  };

  // 通知所有订阅者
  const notify = (newPrice: number) => {
    console.log("通知所有订阅者");
    observers.forEach(observer => observer(newPrice));
  };

  // 修改价格并触发通知
  const changePrice = (newPrice: number) => {
    setPrice(newPrice);
    notify(newPrice);
  };

  return { price, changePrice, subscribe, unsubscribe };

}

export default useStockSubject;