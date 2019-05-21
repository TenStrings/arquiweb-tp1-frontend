import React, { Component } from 'react';
import { Table, Button, Switch, message } from 'antd';
import { CategoryEditForm } from '../components/CategoryModal';
import { categoriesAPI } from '../api';
import { Avatar } from 'antd';

class BackofficeCategories extends Component {
  state = { loading: {} }

  updateCategory(category) {
    const { notifyCategoryChange } = this.props
    return categoriesAPI
      .update(category)
      .then(() => notifyCategoryChange())
  }

  updateCategoryVisibility(category) {
    const { notifyCategoryChange } = this.props
    return categoriesAPI
      .updateVisibility(category)
      .then(() => notifyCategoryChange())
  }

//**************** Visibility Switch ****************//

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

  onVisibilityChange = (checked, category) => {
    this.toggleLoading(category)
    this.updateCategoryVisibility({ ...category, visible: checked })
      .finally(() => this.toggleLoading(category))
      .then(() => message.success("La categoría se actualizó correctamente"))
      .catch(() => message.error("La categoría no pudo actualizarse"))
  }

//**************** Edit button ****************//

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

  onEditCancel = () => {
    const form = this.formRef.props.form;
    form.resetFields()
    this.setState({ modal: null })
  }

  onEditConfirmation = () => {
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
              form.resetFields()
              message.success("La categoría se actualizó correctamente")}
            )
            .catch(() => {
              form.resetFields()
              this.setState({ modal: null })
              form.resetFields()
              message.error("La categoría no pudo actualizarse")
            })
        });
      }
    )
  }

//**************** Delete button *****************//
  deleteCategory(category){
    return categoriesAPI
    .delete(category, this.props.userContext.token)
    .then(() => this.props.notifyCategoryChange())
    .catch(() => console.log("BackofficeCategory: failed to delete category"));
  }

  onDelete = category => {
    this.deleteCategory(category)
    .then(() => message.success("La categoría se eliminó correctamente"))
    .catch(() => message.error("La categoría no pudo eliminarse"))
  }

//**************************************************//

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
        img: <Avatar
        src= {"http://localhost:4000/static/icons/" + category.icon} />,
        visible:
          <Switch
            loading={loading[category._id]}
            defaultChecked={category.visible}
            onChange={
              checked => this.onVisibilityChange(checked, category)}
          />,
        edit: <Button type="primary" shape="circle" icon="edit"
                      onClick={() => this.showEditModal(category)}
              />,
        delete: <Button type="danger" shape="circle" icon="delete"
                        onClick={() => this.onDelete(category)}
                />
      })
    )

    const modalConfirmLoading = this.state.modal && this.state.modal.confirmLoading
    return (
      <React.Fragment>
        <Table columns={columns} dataSource={data} scroll={{ y: 600 }} />);
        <CategoryEditForm
          wrappedComponentRef={this.saveFormRef}
          visible={Boolean(this.state.modal)}
          onCancel={this.onEditCancel}
          onConfirm={this.onEditConfirmation}
          confirmLoading={modalConfirmLoading}
        />
      </React.Fragment>)

  }
}

export default BackofficeCategories;
