import React, { Component } from 'react';
import { Row, Col, Card, message, Divider, Avatar } from 'antd';

import MainMap from '../components/MainMap';
import POIFilter from '../components/POIFilter'
import CategoryFilter from '../components/CategoryFilter'

import { PointAddForm } from '../components/PointModal';

import { poiAPI } from '../api';

const {Meta} = Card;

class Home extends Component {
  NoFilter = function (points) { return points }

  state = {
    nameFilter: this.NoFilter,
    categoryFilter: this.NoFilter,
  }

  getFilteredMarkers = function () {
    const { points } = this.props
    const { nameFilter, categoryFilter } = this.state
    const filteredPoints = nameFilter(categoryFilter(points))
    return filteredPoints.map(point => ({
      position: point.position,
      popUpContent: (<div>
                     <Card
                       style={{ width: 300 }}
                       cover={
                         <img
                           alt="Loading"
                           src={"http://localhost:4000/static/pointImages/" + point.image}
                         />
                       }
                     >
                       <Meta
                         avatar={<Avatar src= {"http://localhost:4000/static/pointImages/" + point.image} />}
                         title={point.name}
                         description={point.description}
                       />
                     </Card>

                     </div>),
      key: point.name,
    }))
  }

  onMapClick = (latlong) => {
    console.log(latlong)
  }

  OnNameFilterChange = aFilter => {
    this.setState({ nameFilter: aFilter })
  }

  OnCategoryFilterChange = aFilter => {
    this.setState({ categoryFilter: aFilter })
  }

  onNewPoint = position => {
    const form = this.formRef.props.form;
    form.setFieldsValue(
      { position: position },
      () => this.setState({
        modal: {
          position: position
        }
      })
    )
  }

  handleAddPointConfirm = () => {
    this.setState(state => {
      const { prevModal } = state
      const newModal = Object.assign({}, prevModal)
      newModal.confirmLoading = true
      return newModal
    })

    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const newPoint = { ...values };
      const promise = poiAPI.add(newPoint)
      promise
        .then(_ => {
          message.success("Marcador agregado correctamente")
          form.resetFields()
          this.setState({ modal: null }, this.props.notifyPointChange)
        }).catch(e => {
          message.error("No pudo insertarse el nuevo marcador")
          console.log(e)
        })

    });
  }

  handleAddPointCancel = () => {
    const form = this.formRef.props.form;
    form.resetFields()
    this.setState({ modal: null })
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }

  render() {
    const { points, categories } = this.props

    const modalConfirmLoading = this.state.modal && this.state.modal.confirmLoading

    const card_header_style = {backgroundColor: 'royalblue', color:'white'}
    const card_style = {
        backgroundColor: 'lightyellow',
        border: '1px solid black',
        borderRadius: '6px',
        borderColor:'black',
        color:'#000000',
    }
    const tabs = [
      { id: "poiFilter",

        render: (<div>
        <br/>
        <Card
          style={card_style}
          title="Nombre"
          headStyle= {card_header_style}
          bordered
          hoverable
        >
            <POIFilter
              onChange={this.OnNameFilterChange}
              poi={points}
            />
        </Card>
        <Divider />
        <Card
          title="Categoría"
          style={card_style}
          headStyle= {card_header_style}
          bordered
          hoverable
        >
            <CategoryFilter
              key={categories}
              updateMapWith={this.OnCategoryFilterChange}
              categories={categories}
            />
        </Card>
        <Divider />
        </div>),
        header: "Filtrar marcadores"
      },
    ]

    return (
      <div className="App">
        <PointAddForm
          wrappedComponentRef={this.saveFormRef}
          visible={Boolean(this.state.modal)}
          onCancel={this.handleAddPointCancel}
          onConfirm={this.handleAddPointConfirm}
          confirmLoading={modalConfirmLoading}
          categories={categories}
        />
        <Row id="Mapa">
          <Col>
            <MainMap
              markers={this.getFilteredMarkers()}
              onClick={this.onMapClick}
              showMyPosition={true}
              onNewPoint={this.onNewPoint}
              tabs={tabs}
            />
          </Col>
        </Row>
      </div>
    );

  }
}

export default Home
