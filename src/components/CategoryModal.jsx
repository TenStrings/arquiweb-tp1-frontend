import { Modal, Form, Input, Alert, Upload, Icon, Button } from 'antd';

import React from 'react';

export const SuggestCategoryForm = Form.create({ name: 'add_category_in_modal' })(
  class extends React.Component {

    state = {suggestedName: ""}

    onSuggestionChange = e => {
      const suggestedName = e.target.value.capitalize()
      const available = !this.props.categories.map(c => c.title).includes(suggestedName)
      this.setState({availableSuggestion: available, suggestedName:suggestedName})
      /*const form = this.props
      form.setFieldsValue(
        { title: suggestedName },
        () => this.setState({availableSuggestion: available, title:suggestedName})
      )*/
    };

    render() {
      const { visible, onConfirm, onCancel, form } = this.props;
      const { suggestedName, availableSuggestion } = this.state;
      const { getFieldDecorator } = form;
      const { suggestionNonEmpty } = suggestedName.length !== 0
      let alert = ""
      if (suggestionNonEmpty){
        if(availableSuggestion){
          alert = <Alert message="Categoría disponible" type="success" showIcon />
        }else{
          alert = <Alert message="Ya existe una categoría con ese nombre" type="error" showIcon />
        }
      }
      return (
        <Modal
          visible={visible}
          title="Sugerir nueva categoría"
          okText="Enviar"
          onOk={onConfirm}
          onCancel={onCancel}
          footer={[
            <Button key="suggestion_cancel" onClick={onCancel}>
              Cancelar
            </Button>,
            <Button key="suggestion_submit" type="primary" onClick={onConfirm}>
              Enviar
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Título">
                {getFieldDecorator('title', {
                  rules: [{ required: true, message: 'Por favor ingrese el título de la categoría' }],
                })(<Input size="large"
                          placeholder="Nombre"
                          onChange={this.onSuggestionChange}
                          allowClear />
                  )
                }
            </Form.Item>
            <Form.Item label="Icono">
             {getFieldDecorator('icon', {
               rules: [{ required: false}],
             })(
             <Upload beforeUpload={file => false} multiple={false}>
               <Button>
                 <Icon type="upload" /> Subir imagen
               </Button>
             </Upload>
               )
             }
            </Form.Item>
            {
              suggestionNonEmpty &&
              <Form.Item label="Message">
              {alert}
              </Form.Item>
            }
          </Form>
        </Modal>
      );
    }
  },
);

export const CategoryEditForm = Form.create({ name: 'edit_category_in_modal' })(
  class extends React.Component {

    render() {
      const { visible, onCancel, onConfirm, form, confirmLoading } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Editar categoría"
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
              <Form.Item label="Icono">
               {getFieldDecorator('icon_file', {
                 rules: [{ required: false}],
               })(
               <Upload beforeUpload={file => false} multiple={false} >
                 <Button>
                   <Icon type="upload" /> Subir imagen
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
