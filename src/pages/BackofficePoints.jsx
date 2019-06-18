import React, { Component } from 'react';
import { Table, Button, Switch, message, Avatar } from 'antd';
import { PointEditForm } from '../components/PointModal';
import { poiAPI } from '../api';


class BackofficePoints extends Component {
  state = { loading: {} }

  updatePoint(point) {
    return poiAPI
    .update(point, this.props.userContext.token)
    .then(() => this.props.notifyPointChange())
    .catch(() => console.log("BackofficePoints: failed to update point"));
  }

  updatePointVisibility(point) {
    return poiAPI
    .updateVisibility(point, this.props.userContext.token)
    .then(() => this.props.notifyPointChange())
    .catch(() => console.log("BackofficePoints: failed to update point"));
  }


  //**************** Visibility Switch ****************//

  toggleLoading(point) {
    this.setState(
      prevState => {
        const { loading } = prevState
        const newLoading = Object.assign({}, loading)
        newLoading[point._id] = !loading[point._id]
        return { loading: newLoading }
      }
    )
  }

  onVisibilityChange = (checked, point) => {
    //const { userContext } = this.props
    this.toggleLoading(point)
    this.updatePointVisibility({...point, visible: checked})
      .finally(() => this.toggleLoading(point))
      .then(() => message.success("El punto se actualizó correctamente"))
      .catch(() => message.error("El punto no pudo actualizarse"))
  }

//**************** Edit button *****************//

  showEditModal = point => {
    const form = this.formRef.props.form;
    form.setFieldsValue(
      { name: point.name,
        description: point.description,
        categoryName:point.categoryName,
      },
      () => {this.setState( prevState => ({
         modal: point,
         refresh_edition_key: !prevState.refresh_edition_key,
      }))}
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
    form.validateFields((err, values) => {
      //TODO: Validar en serio xD
      if (err) {
        return;
      }
      const categoryId = this.props.categories.find( c =>{ return values.categoryName === c.title})._id
      const updatedPoint = {...this.state.modal, ...values, 'categoryId':categoryId };

      //TODO: Probablemente esto debería ser una promise
      this.updatePoint(updatedPoint)
      .then(() => {
        form.resetFields()
        this.setState({ modal: null })
        message.success("El marcador se actualizó correctamente")}
      )
      .catch(() => {
        form.resetFields()
        this.setState({ modal: null })
        message.error("El marcador no pudo actualizarse")
      })
    });
  }

//**************** Delete button *****************//
  deletePoint(point){
    return poiAPI
    .delete(point, this.props.userContext.token)
    .then(() => this.props.notifyPointChange())
    .catch(() => console.log("BackofficePoints: failed to delete point"));
  }

  onDelete = point => {
    this.deletePoint(point)
    .then(() => message.success("El punto se eliminó correctamente"))
    .catch(() => message.error("El punto no pudo eliminarse"))
  }

//**********************************************//

  render() {
    const columns = [
      {
        title: 'Nombre',
        dataIndex: 'name',
      },
      {
        title: 'Descripción',
        dataIndex: 'description',
      },
      {
        title: 'Latitud',
        dataIndex: 'lat',
      },
      {
        title: 'Longitud',
        dataIndex: 'lng',
      },
      {
        title: 'Categoría',
        dataIndex: 'cat',
      },
      {
        title: 'Imagen',
        dataIndex: 'img',
        render: image_link => (<Avatar src= { image_link} />)
      },
      {
        title: 'Visible',
        dataIndex: 'visible',
        render: point => (<Switch
                            loading={loading[point._id]}
                            defaultChecked={point.visible}
                            onChange={checked => this.onVisibilityChange(checked, point)}
                          />)
      },
      {
        title: 'Origen',
        dataIndex: 'source',
        render: point => (<a
                            href={point.provider.site_url}
                            target="_blank"
                          >
                          {point.provider.name}
                          </a>)
      },
      {
        title: 'Editar',
        dataIndex: 'edit',
        render: point => (<Button
                            type="primary"
                            shape="circle"
                            icon="edit"
                            onClick={ () => this.showEditModal(point)}
                          />)
      },
      {
        title: 'Borrar',
        dataIndex: 'delete',
        render: point => (<Button
                            type="danger"
                            shape="circle"
                            icon="delete"
                            onClick={ () => this.onDelete(point)}
                          />)
      }
    ];

    const { loading } = this.state;
    const { points, categories } = this.props;

    const data = points && categories && points.map(
      point => ({
        key: point._id,
        name: point.name,
        lat: parseFloat(point.position.lat).toFixed(2).toString(),
        lng: parseFloat(point.position.lng).toFixed(2).toString(),
        description: point.description,
        cat: point.categoryName,
        img: point.image,
        visible: point,
        source: point,
        edit: point,
        delete: point,
      })
    )

    return (
      <React.Fragment>
        <Table columns={columns} dataSource={data} scroll={{ y: 600 }} />
        <PointEditForm
          wrappedComponentRef={this.saveFormRef}
          visible={Boolean(this.state.modal)}
          onCancel={this.onEditCancel}
          onConfirm={this.onEditConfirmation}
          categories={categories}
        />
      </React.Fragment>)
  }
}

export default BackofficePoints;
