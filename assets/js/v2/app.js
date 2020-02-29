import { Link, Router } from '@reach/router';
import { Breadcrumb, Layout, Menu, Typography } from 'antd';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Member } from './Member';
import { Members } from './Members';
import { MembersList } from './Members/MembersList';
import { MemberSignin } from './MemberSignin';
import { NewMember } from './NewMember';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App = () => (
  <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1">
          <Link to="/">Sign In</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/members">Members</Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/members/new">New Member</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/bikes">Bikes</Link>
        </Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ background: '#fff', padding: 24, minHeight: '100vh' }}>
        <Router>
          <MemberSignin path="/" />
          <Members path="members">
            <MembersList path="/" />
            <Member path=":id" />
            <NewMember path="new" />
          </Members>
        </Router>
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>
      Ant Design ©2018 Created by Ant UED
    </Footer>
  </Layout>
);

export default hot(App);
