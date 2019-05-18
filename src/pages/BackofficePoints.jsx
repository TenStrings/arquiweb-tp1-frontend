import React, { Component } from 'react';
import { Table, Button, Switch } from 'antd';
import axios from 'axios';
import { PointEditForm } from '../components/PointModal';

class BackofficePoints extends Component {
  state = { loading: {} }

  updatePoint = (point) => axios.put('http://localhost:4000/point/' + point._id, point)
    .then(_ => {
      this.props.notifyPointChanged()
      this.toggleLoading(point._id)
    }).catch(() => console.log("BackofficePoints failed to update point"));

  //**************** Visibility Switch ****************//

  toggleLoading(pointId) {
    this.setState(
      prevState => {
        const { loading } = prevState
        const newLoading = Object.assign({}, loading)
        newLoading[pointId] = !loading[pointId]
        return { loading: newLoading }
      }
    )
  }

  onVisibilityChange = (checked, pointId) => {
    //const { userContext } = this.props
    this.toggleLoading(pointId)
    let pointToUpdate = this.props.points.find(point => point._id === pointId)
    pointToUpdate.visible = !checked
    this.updatePoint(pointToUpdate)
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

  handleCancel = () => {
    const form = this.formRef.props.form;
    form.resetFields()
    this.setState({ modal: null })
  }

  handleConfirm = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      //TODO: Validar en serio xD
      if (err) {
        return;
      }

      const newPoint = {...this.state.modal, ...values };

      //TODO: Probablemente esto debería ser una promise
      this.updatePoint(newPoint)

      form.resetFields();
      this.setState({ modal: null });
    });
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
        visible: <Switch loading={loading[point._id]} defaultChecked={point.visible} onChange={checked =>
          this.onVisibilityChange(checked, point._id)
        } />,
        edit: <Button type="primary" shape="circle" icon="edit" onClick={
          () => this.showEditModal(point)
        }></Button>,
        delete: <Button type="danger" shape="circle" icon="delete"></Button>
      })
    )

    return (
      <React.Fragment>
        <Table columns={columns} dataSource={data} scroll={{ y: 600 }} />);
        <PointEditForm
          wrappedComponentRef={this.saveFormRef}
          visible={Boolean(this.state.modal)}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
      </React.Fragment>)
  }
}

export default BackofficePoints;
