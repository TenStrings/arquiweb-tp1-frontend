import { Modal, Form, Input } from 'antd';
import React from 'react';
import { Select } from 'antd';

export const PointEditForm = Form.create({ name: 'edit_point_in_modal' })(
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

export const PointAddForm = Form.create({ name: 'add_point_in_modal' })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onConfirm, form, categories } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Agregar punto"
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
            <Form.Item label="Categoría">
              {getFieldDecorator('category')(
                <Select>
                  {categories.map(category => (
                    <Select.Option value={category.title} key={category.title}>
                      {category.title}
                    </Select.Option>)
                  )}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Posición">
              {getFieldDecorator('position')(<Input disabled type="textarea" />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);