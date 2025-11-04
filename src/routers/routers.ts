import { RouteObject } from 'react-router-dom';
import LayoutBase from '../layout';
import Home from '../pages/home';
import Login from '../pages/login';
import Redis from '../pages/redis';
import IndexDB from '../pages/indexDB';
import BigFile from '../pages/bigFile';
import LongList from '../pages/longList';
import NodeLoad from '../pages/nodeLoad';
import Observer from '../pages/observer';
import Strategy from '../pages/strategy';
import Map from '../pages/map';
import Simplepeer from '../pages/simPlePeer';
import DrawingBoard from '../pages/drawingBoard';
import ErrorBoundaryTest from '../pages/errorBoundaryTest';
import ReactFiber from '../pages/reactFiber';
import MemoryLeakTest from '../pages/memoryLeak';
import DataFlowExample from '../examples/DataFlowExample';
import React from 'react';
import { HomeOutlined, CloudOutlined, FlagOutlined, WomanOutlined, UngroupOutlined, CopyrightOutlined, CompassOutlined, SendOutlined, BugOutlined, ShareAltOutlined, ThunderboltOutlined, AlertOutlined } from '@ant-design/icons';

export type CustomRouteObject = RouteObject & {
  meta?: {
    title?: string;
    icon?: React.ReactNode;
    hidden?: boolean;
    roles?: string[];
  };
  children?: CustomRouteObject[];
};
const routes: CustomRouteObject[] = [
  {
    path: '/login',
    element: React.createElement(Login),
    children: [],
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/',
    element: React.createElement(LayoutBase),
    meta: {
      title: '主页',
      icon: React.createElement(HomeOutlined),
      hidden: true,
    },
    children: [
      {
        path: 'home',
        element: React.createElement(Home),
        meta: {
          title: '首页',
          icon: React.createElement(HomeOutlined),
        },
      },
      {
        path: 'redis',
        element: React.createElement(Redis),
        meta: {
          title: '模拟redis',
          icon: React.createElement(CloudOutlined),
        },
      },
      {
        path: 'index-db',
        element: React.createElement(IndexDB),
        meta: {
          title: 'IndexDB',
          icon: React.createElement(FlagOutlined),
        },
      },
      {
        path: 'big-file',
        element: React.createElement(BigFile),
        meta: {
          title: 'web投屏',
          icon: React.createElement(WomanOutlined),
        },
      },
      {
        path: 'long-list',
        element: React.createElement(LongList),
        meta: {
          title: '长列表优化',
          icon: React.createElement(UngroupOutlined),
        },
      },
      {
        path: 'node-load',
        element: React.createElement(NodeLoad),
        meta: {
          title: '懒加载',
          icon: React.createElement(CompassOutlined),
        },
      },
      {
        path: 'observer',
        element: React.createElement(Observer),
        meta: {
          title: '发布订阅模式',
          icon: React.createElement(CopyrightOutlined),
        },
      },
      {
        path: 'strategy',
        element: React.createElement(Strategy),
        meta: {
          title: '策略模式',
          icon: React.createElement(CopyrightOutlined),
        },
      },
      {
        path: 'map',
        element: React.createElement(Map),
        meta: {
          title: '地图',
          icon: React.createElement(SendOutlined),
        },
      },
      {
        path: '/simplePeer',
        element: React.createElement(Simplepeer),
        meta: {
          title: 'simplePeer浏览器投屏',
          icon: React.createElement(SendOutlined),
        },
      },
      {
        path: '/drawingBoard',
        element: React.createElement(DrawingBoard),
        meta: {
          title: '画板',
          icon: React.createElement(SendOutlined),
        },
      },
      {
        path: 'error-boundary-test',
        element: React.createElement(ErrorBoundaryTest),
        meta: {
          title: '错误边界测试',
          icon: React.createElement(BugOutlined),
        },
      },
      {
        path: 'react-fiber',
        element: React.createElement(ReactFiber),
        meta: {
          title: 'React Fiber架构',
          icon: React.createElement(ThunderboltOutlined),
        },
      },
      {
        path: 'memory-leak-test',
        element: React.createElement(MemoryLeakTest),
        meta: {
          title: '内存泄漏测试',
          icon: React.createElement(AlertOutlined),
        },
      },
    ],
  },

];

export default routes;