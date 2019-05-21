import { Modal, Form, Input } from 'antd';
import React from 'react';
import { Select } from 'antd';

export const authModal = Form.create({ name: 'log_in' })(
  class extends React.Component {

    render() {

      const { visible, onCancel, onSubmit, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        const { getFieldDecorator } = this.props.form;
        <Modal
          visible={visible}
          title="Ingresar"
          okText="Ingresar"
          onCancel={onCancel}
          onOk={onSubmit}
        >
            <Form className="login-form">
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
            </Form>

        </Modal>
      );
    }
  },
);
