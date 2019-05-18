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
            <Icon type="pushpin" />
            Mapa
          </Link>
        </Menu.Item>

        <SubMenu title={<span><Icon type="tags" />Colaborar</span>}>
          <Menu.Item key="addPoint">Agregar marcador (temp)</Menu.Item>
          <Menu.Item key="suggestCat">Sugerir nueva categoría</Menu.Item>
        </SubMenu>
        {user && user.admin &&
          (<SubMenu title={<span><Icon type="setting" />Backoffice</span>}>
            <Menu.Item key="addPoint">
              <Link to="/backoffice_points"></Link>
              Marcadores
            </Menu.Item>
            <Menu.Item key="suggestCat">
              <Link to="/backoffice_categories"></Link>
              Categorías
            </Menu.Item>
          </SubMenu>)
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
