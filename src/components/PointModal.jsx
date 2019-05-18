import {  Modal, Form, Input } from 'antd';
import React from 'react';

const PointEditForm = Form.create({ name: 'edit_point_in_modal' })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onConfirm, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Editar punto"
          okText="Confirmar"
          onCancel={onCancel}
          onOk={onConfirm}
        >
          <Form layout="vertical">
            <Form.Item label="Nombre">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Por favor ingrese el nombre del punto' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Descripción">
              {getFieldDecorator('description')(<Input type="textarea" />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

export default PointEditForm;
