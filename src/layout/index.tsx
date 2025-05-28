import React, { useEffect, useState } from 'react';
import { Breadcrumb, Layout, Menu, theme, Watermark } from 'antd';
import './index.less';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { generateMenuItems } from '../utils';
import routes from '../routers/routers';
const { Header, Content, Footer, Sider } = Layout;
const index: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['home']);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    console.log(key);
    
    setSelectedKeys([key]);
    navigate(key);
  
  };


   // 根据路由变化更新选中状态
   useEffect(() => {
    const currentPath = location.pathname.replace(/^\//, '');
    console.log(currentPath);
    
    setSelectedKeys([currentPath]);
    // 自动展开包含当前路由的子菜单
    // const parentPath = findParentPath(routes, currentPath);
    // if (parentPath) {
    //   setOpenKeys([parentPath]);
    // }
  }, [location.pathname]);


  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const menuItems = generateMenuItems(routes.find(r => r.path === '/')?.children || []);


  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="logo-img" />
        <div className='logo-title'>react-redis-test</div>
      </Header>
      <div style={{ margin: '0 auto', width: 'calc(100% - 32px)' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
        </Breadcrumb>
        <Watermark content="liuhuan" >
        <Layout
          style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG }}
        >
          <Sider style={{ background: colorBgContainer }} className='layout-sider'>
            <Menu
              mode="inline"
              selectedKeys={selectedKeys}
              // defaultSelectedKeys={['strategy']}
              // defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
              onClick={handleMenuClick}
              items={menuItems}
            />
          </Sider>          
          <Content className='layout-content'>
              <Outlet />
          </Content>
        </Layout>
        </Watermark>
      </div>
      <Footer className='layout-footer'>
        react-redis-test ©{new Date().getFullYear()} Created by LIUHUAN
      </Footer>
    </Layout>
  );
};

export default index;