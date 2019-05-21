import React from 'react';
import {message} from 'antd';
import {
  Form, Icon, Input, Button,
} from 'antd';

import './SignUp.css'

class RegisterForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //this.props.userContext.register(values.username, values.password)
        message.success("Usuario registrado correctamente.") //ponele
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="signup-form">
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
          <Button type="primary" htmlType="submit" className="signup-form-button">
            Registrarse
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const SignUp = Form.create({ name: 'signUp' })(RegisterForm);

export default SignUp;
