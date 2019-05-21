import { Modal, Form, Input, Upload, Icon, Button } from 'antd';
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
              })(<Input/>)}
              </Form.Item>

              <Form.Item label="Image">
               {getFieldDecorator('icon', {
                 rules: [{ required: true, message: 'Por favor ingrese un ícono de categoría'}],
               })(
               <Upload beforeUpload={file => false}>
                 <Button>
                   <Icon type="upload" /> Click to Upload
                 </Button>
               </Upload>
                 )}
             </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);
