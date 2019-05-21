import React, { Component } from 'react';
import { Menu, Icon, Input, Alert, message, Modal, Button } from 'antd';
import { Link } from "react-router-dom";

import { suggestionsAPI } from '../api';
//import { authModal } from './AuthModal';


const SubMenu = Menu.SubMenu;
String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

class NavigationMenu extends Component {

  state = {
    loading: false,
    suggestModalVisible: false,
    suggestedCategory: ""
  };

  handleClick = (e) => {
     const { key } = e
     if (key === "logout") {
       this.props.userContext.logout()
       this.props.history.push("/");
       this.props.notifyLogOut()
     }
     else if (key === "suggest_category") this.showSuggestModal()
     let { onClick } = this.props
     onClick && onClick(e.key)
   }
  //****************** Suggestions *************************//
  showSuggestModal = () => {
    this.setState({
      suggestModalVisible: true, suggestedCategory: ""
    });
  };

  onSuggestionSubmission = () => {
    this.setState({ loading: true });
    const suggestion = {
        'title' : this.state.suggestedCategory,
        'icon' :  "iconito TODO in NavMenu"
    }
    suggestionsAPI.add(suggestion)
    .then(_ => {
        message.success("Sugerencia agregada correctamente")
        this.setState({ loading: false, suggestModalVisible: false, suggestedCategory: ""},
                      this.props.notifyNewSuggestion)
      }).catch(e => {
        message.error("No pudo realizarse la sugerencia.")
        console.log(e)
        this.setState({ loading: false, suggestModalVisible: false, suggestedCategory: "" });
      })
  };

  onSuggestionCancel = e => {
    this.setState({ suggestModalVisible: false });
  };

  onSuggestionChange = e => {
    const suggestedName = e.target.value.capitalize()
    const available = !this.props.categories.map(c => c.title).includes(suggestedName)
    this.setState({ availableSuggestion: available , suggestedCategory: suggestedName});
  };

  //************************* Log in *********************//
  /*
  handleLogIn = () => {
    this.setState(state => {
      const { prevModal } = state
      const newModal = Object.assign({}, prevModal)
      newModal.confirmLoading = true
      return newModal
    })

    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (!err) {
        await this.props.userContext.login(values.username, values.password)
        form.resetFields()
        this.setState({ authModal: null })
      }
    });
  }

  handleAuthCancel = () => {
    const form = this.formRef.props.form;
    form.resetFields()
    this.setState({ authModal: null })
  }

  saveLoginFormRef = formRef => {
    this.formRef = formRef
  }*/

  render() {
    const { user } = this.props.userContext
    const { suggestModalVisible, loading, availableSuggestion, suggestedCategory} = this.state;

    return (
        <React.Fragment>
          <Modal
            visible={suggestModalVisible}
            title="Sugerir nueva categoría"
            onOk={this.onSuggestionSubmission}
            onCancel={this.onSuggestionCancel}
            footer={[
              <Button key="suggestion_cancel" onClick={this.onSuggestionCancel}>
                Cancelar
              </Button>,
              <Button key="suggestion_submit" type="primary" loading={loading} onClick={this.onSuggestionSubmission}>
                Enviar
              </Button>,
            ]}
          >
              <Input size="large" placeholder="Nombre" onChange={this.onSuggestionChange} value={suggestedCategory} allowClear />
              {suggestedCategory && availableSuggestion && <Alert message="Categoría disponible" type="success" showIcon /> }
              {suggestedCategory && !availableSuggestion && <Alert message="Ya existe una categoría con ese nombre" type="error" showIcon /> }

          </Modal>
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
              (user || this.props.mockedUser) &&
              (
                <Menu.Item key="logout">
                  <Icon type="logout" />Logout
                </Menu.Item>
              )
            }
            {
              (!user && !this.props.mockedUser) &&
              (
                <Menu.Item key="login">
                  <Link to="/login">
                    <Icon type="login" />Login
                </Link>
                </Menu.Item>
              )
            }
            {
              (!user && !this.props.mockedUser) &&
              (
                <Menu.Item key="signUp">
                  <Link to="/register">
                    <Icon type="form" />Sign up
                  </Link>
                </Menu.Item>
              )
            }
        </Menu>
    </React.Fragment>
    );
  }
}

export default NavigationMenu;
