import { Modal, Form, Input } from 'antd';
import React from 'react';

export const CategoryEditForm = Form.create({ name: 'edit_category_in_modal' })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onConfirm, form, confirmLoading } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Editar punto"
          okText="Confirmar"
          onCancel={onCancel}
          onOk={onConfirm}
          confirmLoading={confirmLoading}
        >
          <Form layout="vertical">
            <Form.Item label="Nombre">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Por favor ingrese el nombre de la categoría' }],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);