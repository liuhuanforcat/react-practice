// src/routers/RouterWrapper.tsx
import { useRoutes, useNavigate } from 'react-router-dom';
import routes from './routers';
import { useEffect } from 'react';
const RouterWrapper = () => {
  const navigate = useNavigate();
  const routeElements = useRoutes(routes);

  //路由守卫
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoginPage = location.pathname === '/login';

    // 没有 token 并且不是在 login 页面时，强制跳转到 login
    if (!token && !isLoginPage) {
      navigate('/login', { replace: true });
    }

    // 如果已经登录了，访问 login 页面，可以跳转到首页（可选）
    if (token && isLoginPage) {
      navigate('/home', { replace: true });
    }

  }, [location.pathname, navigate]);

  return routeElements;
};

export default RouterWrapper;