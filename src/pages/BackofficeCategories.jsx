import React, { Component } from 'react';
import { Table, Button, Switch, message } from 'antd';
import { CategoryEditForm } from '../components/CategoryModal';
import { categoriesAPI } from '../api';

class BackofficeCategories extends Component {
  state = { loading: {} }

  toggleLoading(category) {
    this.setState(
      prevState => {
        const { loading } = prevState
        const newLoading = Object.assign({}, loading)
        newLoading[category._id] = !loading[category._id]
        return { loading: newLoading }
      }
    )
  }

  updateCategory(category) {
    const { notifyCategoryChange } = this.props
    return categoriesAPI
      .update(category)
      .then(() => notifyCategoryChange())
  }

  onChange = (checked, category) => {
    this.toggleLoading(category)
    this.updateCategory({ ...category, visible: !checked })
      .finally(() => this.toggleLoading(category))
      .then(() => message.success("La categoría se actualizó correctamente"))
      .catch(() => message.error("La categoría no pudo actualizarse"))
  }

  showEditModal = category => {
    const form = this.formRef.props.form;
    form.setFieldsValue({ title: category.title }, () =>
      this.setState({
        modal: {
          category: category,
          confirmLoading: false
        }
      })
    )
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }

  handleCancel = () => {
    const form = this.formRef.props.form;
    form.resetFields()
    this.setState({ modal: null })
  }

  handleConfirm = () => {
    const form = this.formRef.props.form;

    this.setState(
      prevState => ({ modal: { ...prevState.modal, confirmLoading: true } }),
      () => {
        form.validateFields((err, values) => {
          //TODO: Validar en serio xD
          if (err) {
            return;
          }

          const oldCategory = this.state.modal.category

          const newCategory = { ...oldCategory, ...values }

          this.updateCategory(newCategory)
            .then(() => {
              form.resetFields()
              this.setState({ modal: null })
              message.success("La categoría se actualizó correctamente")}
            )
            .catch(() => {
              form.resetFields()
              this.setState({ modal: null })
              message.error("La categoría no pudo actualizarse")
            })
        });
      }
    )
  }

  render() {
    const columns = [
      {
        title: 'Nombre', width: 200, dataIndex: 'name',
      },
      {
        title: 'Icono', dataIndex: 'img', width: 50, //button with card or popUp with image
      },
      {
        title: 'Visible', dataIndex: 'visible', width: 50, //button with card or popUp with image
      },
      {
        title: 'Editar', dataIndex: 'edit', width: 50,
      },
      {
        title: 'Borrar', dataIndex: 'delete', width: 50,
      }
    ];
    const { loading } = this.state;
    const { categories } = this.props;

    const data = categories.map(
      category => ({
        key: category._id,
        name: category.title,
        img: "unBoton a img",
        visible:
          <Switch
            loading={loading[category._id]}
            defaultChecked={category.visible}
            onChange={
              checked => this.onChange(checked, category)}
          />,
        edit: <Button type="primary" shape="circle" icon="edit" onClick={
          () => this.showEditModal(category)
        }></Button>,
        delete: <Button type="danger" shape="circle" icon="delete"></Button>
      })
    )

    const modalConfirmLoading = this.state.modal && this.state.modal.confirmLoading
    return (
      <React.Fragment>
        <Table columns={columns} dataSource={data} scroll={{ y: 600 }} />);
        <CategoryEditForm
          wrappedComponentRef={this.saveFormRef}
          visible={Boolean(this.state.modal)}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          confirmLoading={modalConfirmLoading}
        />
      </React.Fragment>)
  }
}

export default BackofficeCategories;
