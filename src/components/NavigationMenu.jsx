import React, { Component } from 'react';
import { Menu, Icon, message } from 'antd';
import { Link } from "react-router-dom";

import { suggestionsAPI } from '../api';
//import { authModal } from './AuthModal';
import { SuggestCategoryForm } from './CategoryModal';


const SubMenu = Menu.SubMenu;
String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

class NavigationMenu extends Component {

  state = {
    suggestionModal : null,
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
  saveFormRef = formRef => {
    this.formRef = formRef
  }

  showSuggestModal = () => {
    this.setState(prevState => ({
      suggestionModal: {},
    }));
  };
  /*
  , Upload, Button
  showSuggestModal = () => {
  const form = this.formRef.props.form;
  form.setFieldsValue(
    {icon: <Upload beforeUpload={file => false} multiple={false}>
                <Button>
                  <Icon type="upload" /> Subir imagen
                </Button>
            </Upload>
    },
    () => this.setState({
      suggestionModal: {}
    })
  )
  }
  */

  onSuggestionSubmission = () => {
    this.setState(state => {
      const { suggestionModal } = this.state
      const newModal = Object.assign({}, suggestionModal)
      newModal.confirmLoading = true
      return newModal
    })

    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const newSuggestion = {...values};
      const promise = suggestionsAPI.add(newSuggestion)
      promise
        .then(_ => {
          message.success("Sugerencia agregada correctamente.")
          form.resetFields()
          this.setState({ suggestionModal: null }, this.props.notifyNewSuggestion)
        }).catch(e => {
          message.error("No pudo realizarse la sugerencia.")
          console.log(e)
        })

    });
  };

  onSuggestionCancel = e => {
    const form = this.formRef.props.form;
    form.resetFields()
    this.setState({ suggestionModal: null })
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
    const modalConfirmLoading = this.state.suggestionModal && this.state.suggestionModal.confirmLoading

    return (
        <React.Fragment>
          <SuggestCategoryForm
            wrappedComponentRef={this.saveFormRef}
            visible={Boolean(this.state.suggestionModal)}
            onConfirm={this.onSuggestionSubmission}
            onCancel={this.onSuggestionCancel}
            confirmLoading={modalConfirmLoading}
            categories={this.props.categories}
          />
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
              {user &&
              <Menu.Item key="suggest_category">
                  <Icon type="tags" />
                  Sugerir categoría
              </Menu.Item>
              }
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
