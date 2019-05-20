import React, { Component } from 'react';
import { Table, Button, Switch, message } from 'antd';
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
    this.updatePoint({...point, visible: checked})
      .finally(() => this.toggleLoading(point))
      .then(() => message.success("El punto se actualizó correctamente"))
      .catch(() => message.error("El punto no pudo actualizarse"))
  }

//**************** Edit button *****************//

  showEditModal = point => {
    const form = this.formRef.props.form;
    form.setFieldsValue({ name: point.name, description: point.description }, () => {
      this.setState({ modal: point})}
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

      const newPoint = {...this.state.modal, ...values };

      //TODO: Probablemente esto debería ser una promise
      this.updatePoint(newPoint)
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
        title: 'Nombre', width: 200, dataIndex: 'name',
      },
      {
        title: 'Descripción', width: 250, dataIndex: 'description',
      },
      {
        title: 'Latitud', dataIndex: 'lat', width: 100,
      },
      {
        title: 'Longitud', dataIndex: 'lng', width: 100,
      },
      {
        title: 'Imagen', dataIndex: 'img', width: 50, //button with card or popUp with image
      },
      {
        title: 'Categoría', dataIndex: 'cat', width: 200,
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
    const { points, categories } = this.props;

    const data = points && categories && points.map(
      point => ({
        key: point._id,
        name: point.name,
        lat: point.position.lat,
        lng: point.position.lng,
        description: point.description,
        img: "unBoton a img",
        cat: point.categoryName,
        visible: <Switch loading={loading[point._id]} defaultChecked={point.visible}
                         onChange={checked => this.onVisibilityChange(checked, point)}
                 />,
        edit: <Button type="primary" shape="circle" icon="edit"
                      onClick={ () => this.showEditModal(point)}
              />,
        delete: <Button type="danger" shape="circle" icon="delete"
                        onClick={ () => this.onDelete(point)}
                />
      })
    )

    return (
      <React.Fragment>
        <Table columns={columns} dataSource={data} scroll={{ y: 600 }} />);
        <PointEditForm
          wrappedComponentRef={this.saveFormRef}
          visible={Boolean(this.state.modal)}
          onCancel={this.onEditCancel}
          onConfirm={this.onEditConfirmation}
        />
      </React.Fragment>)
  }
}

export default BackofficePoints;
