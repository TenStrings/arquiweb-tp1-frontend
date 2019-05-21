import React from 'react';

import {
  Form, Icon, Input, Button,
} from 'antd';

import './Login.css'

class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
         if(values.username ==='admin' && values.password==='admin')this.props.userContext.login(values.username, values.password)
        this.props.notifyLogIn()
        this.props.history.push("/");
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Por favor ingresa un nombre de usuario' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Nombre de usuario" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Por favor ingresa una contraseña' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Contraseña" />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Ingresar
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const Login = Form.create({ name: 'login' })(NormalLoginForm);

export default Login;
