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
import RemTest from '../pages/remTest';
import SliderCaptchaPage from '../pages/sliderCaptcha';
import React from 'react';
import { HomeOutlined, CloudOutlined, FlagOutlined, WomanOutlined, UngroupOutlined, CopyrightOutlined, CompassOutlined, SendOutlined, MobileOutlined, SafetyOutlined, ApiOutlined, BookOutlined, ThunderboltOutlined, ClusterOutlined, DatabaseOutlined, MessageOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import DslAgentPage from '../pages/dslAgent';
import JavaBasicsPage from '../pages/javaBasics';
import SpringBootPage from '../pages/springBoot';
import SpringCloudAlibabaPage from '../pages/springCloudAlibaba';
import RedisInterviewPage from '../pages/redisInterview';
import KafkaInterviewPage from '../pages/kafkaInterview';
import MySQLInterviewPage from '../pages/mysqlInterview';

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
        path: '/dsl-agent',
        element: React.createElement(DslAgentPage),
        meta: {
          title: 'DSL 需求生成',
          icon: React.createElement(ApiOutlined),
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
        path: '/rem-test',
        element: React.createElement(RemTest),
        meta: {
          title: 'Rem适配测试',
          icon: React.createElement(MobileOutlined),
        },
      },
      {
        path: '/slider-captcha',
        element: React.createElement(SliderCaptchaPage),
        meta: {
          title: '滑块验证码',
          icon: React.createElement(SafetyOutlined),
        },
      },
      {
        path: 'java-basics',
        element: React.createElement(JavaBasicsPage),
        meta: {
          title: 'Java 八股文',
          icon: React.createElement(BookOutlined),
        },
      },
      {
        path: 'spring-boot',
        element: React.createElement(SpringBootPage),
        meta: {
          title: 'Spring Boot',
          icon: React.createElement(ThunderboltOutlined),
        },
      },
      {
        path: 'spring-cloud-alibaba',
        element: React.createElement(SpringCloudAlibabaPage),
        meta: {
          title: 'Spring Cloud Alibaba',
          icon: React.createElement(ClusterOutlined),
        },
      },
      {
        path: 'redis-interview',
        element: React.createElement(RedisInterviewPage),
        meta: {
          title: 'Redis 面试题',
          icon: React.createElement(DatabaseOutlined),
        },
      },
      {
        path: 'kafka-interview',
        element: React.createElement(KafkaInterviewPage),
        meta: {
          title: 'Kafka 面试题',
          icon: React.createElement(MessageOutlined),
        },
      },
      {
        path: 'mysql-interview',
        element: React.createElement(MySQLInterviewPage),
        meta: {
          title: 'MySQL 面试题',
          icon: React.createElement(ConsoleSqlOutlined),
        },
      },
    ],
  },

];

export default routes;