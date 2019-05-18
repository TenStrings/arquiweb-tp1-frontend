import React, { Component } from 'react';
import { Menu, Icon } from 'antd';

import { Link } from "react-router-dom";

const SubMenu = Menu.SubMenu;

class NavigationMenu extends Component {
  state = { loginModalShow: false };

  handleClick = (e) => {
    const { key } = e
    if (key === "logout") {
      this.props.userContext.logout()
    }
    let { onClick } = this.props
    onClick && onClick(e.key)
  }

  render() {
    const { user } = this.props.userContext

    return (
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
        >
            <Menu.Item key="map">
              <Link to="/">
                <Icon type="search" />
                Mapa
              </Link>
            </Menu.Item>

            <Menu.Item key="suggest_category">
                <Icon type="tags" />
                Sugerir categoría
            </Menu.Item>

            {user && user.admin &&
            <SubMenu title={<span><Icon type="setting" />Backoffice</span>}>
                <Menu.Item key="backoffice_points">
                  <Link to="/backoffice_points"></Link>
                  <span>
                    <Icon type="pushpin" />
                    <span>Marcadores</span>
                  </span>
                </Menu.Item>

                <SubMenu
                  key="subumenu_categorias"
                  title={
                    <span>
                      <Icon type="tags" />
                      <span>Categorias</span>
                    </span>
                  }
                >
                    <Menu.Item key="backoffice_approved_categories">
                      <Link to="/backoffice_approved_categories"></Link>
                      Aprobadas
                    </Menu.Item>

                    <Menu.Item key="backoffice_suggested_categories">
                      <Link to="/backoffice_suggested_categories"></Link>
                      Solicitadas
                    </Menu.Item>

                </SubMenu>
          </SubMenu>
          }

          {
            user &&
            (
              <Menu.Item key="logout">
                <Icon type="logout" />Logout
              </Menu.Item>
            )
          }
          {
            !user &&
            (
              <Menu.Item key="login">
                <Link to="/login">
                  <Icon type="login" />Login
              </Link>
              </Menu.Item>
            )
          }
          {
            !user &&
            (
              <Menu.Item key="signUp">
                <Link to="/login">
                  <Icon type="form" />Sign up
                          </Link>
              </Menu.Item>
            )
          }
      </Menu>
    );
  }
}

export default NavigationMenu;
