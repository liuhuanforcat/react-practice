import { MenuProps } from 'antd';
import { CustomRouteObject } from '../routers/routers';

export const generateMenuItems = (routes: CustomRouteObject[]): MenuProps['items'] => {
  if (!Array.isArray(routes)) {
    console.error('Invalid routes: Expected an array');
    return [];
  }

  return routes
    .filter(route => route.path && !route.meta?.hidden) // 确保 path 存在并过滤 hidden 为 true 的路由
    .map(route => {
      // 如果有 children 且不为空，递归处理
      const children = Array.isArray(route.children) && route.children.length
        ? generateMenuItems(route.children)
        : undefined;

      return {
        key: route.path || '', // 确保 key 不为空
        icon: route.meta?.icon || null, // 如果没有 icon，设置为 null
        label: route.meta?.title || route.path || 'Unnamed', // 确保 label 不为空
        children,
      };
    });
};


export const timeBasedUUID = () => {
  const timePart = Date.now().toString(16).padStart(12, '0');
  const randomPart = Math.random().toString(16).substring(2, 10);
  return `${timePart}${randomPart}`;
}

export const asyncTaskQueueAction = (max = 3) => {

  let queue: any = [];
  let running = 0;

  const addTask = (tasks: (() => Promise<void>)[]) => {
    for (let i = 0; i < tasks.length; i++) {
      queue.push(tasks[i]);
      run();
    }
  }

  const run = () => {
    if (running >= max) {
      return
    }
    const task = queue.shift();
    running++;
    task().finally(() => {
      running--;
      run();
    });
  }
  return { addTask }
}

