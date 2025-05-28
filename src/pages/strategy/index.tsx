import React from 'react';
import './index.less';

function index() {
  //策略模式：定义一系列算法，把它们一个个封装起来，并且使它们可以互相替换。这个模式让算法的变化独立于使用算法的客户。
  //场景：表单验证： 表格排序/筛选：动态渲染策略（不同 UI 展示方式）。
  // 下面的代码就是策略模式
  // const validationStrategies = {
  //   email: (value) => /^\S+@\S+\.\S+$/.test(value) || "请输入有效的邮箱",
  //   phone: (value) => /^1[3-9]\d{9}$/.test(value) || "请输入有效的手机号",
  //   password: (value) => value.length >= 8 || "密码至少8位",
  // };

  //普通写法  
  const renderDigitalLayer = (type: string, num: number) => {
    if (type === 'num1') {
      return <div className="simple-circle1">{num}</div>;
    } else if (type === 'num2') {
      return <div className="simple-circle">{num}</div>;
    }
    return null; // 如果没有匹配的类型，返回 null
  };

  //策略模式写法，简洁易维护，减少了if else判断
  const DigitalLayer = {
    num1: (num: Number) => {
      return <div className='simple-circle1'>{num as any}</div>
    },
    num2: (num: Number) => {
      return <div className='simple-circle'>{num as any}</div>
    },
  }
  return <div>

    {DigitalLayer.num1(123)}
    {DigitalLayer.num2(456)}
    {renderDigitalLayer('num1', 123)}
    {renderDigitalLayer('num2', 456)}

  </div>;
}
export default index;