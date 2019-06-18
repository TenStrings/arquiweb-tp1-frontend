import React, { Component } from 'react';
import { Row, Col, Card, message, Divider, Avatar } from 'antd';
import {withRouter} from 'react-router-dom'

import MainMap from '../components/MainMap';
import POIFilter from '../components/POIFilter'
import CategoryFilter from '../components/CategoryFilter'

import { PointAddForm } from '../components/PointModal';

import { poiAPI } from '../api';
import { withUserContext } from '../context/withUserContext';

const ContextMainMap = withRouter(withUserContext(MainMap))

const {Meta} = Card;

class Home extends Component {
  NoFilter = function (points) { return points }

  state = {
    nameFilter: this.NoFilter,
    categoryFilter: this.NoFilter,
  }

  getFilteredMarkers = function () {
    const { points, categories } = this.props
    const { nameFilter, categoryFilter } = this.state
    const filteredPoints = nameFilter(categoryFilter(points))
    return filteredPoints.map(point => {
        const source = <a
                          href={point.provider.site_url}
                          target="_blank"
                       >
                       Origen: {point.provider.name}
                       </a>
        let categoryIcon = ""
        let category = null
        if(point.extern){
            category = categories.find( c => {return c.provider.cat_abs_id === point.provider.cat_abs_id})
        }else {
            category = categories.find(c => {return c._id === point.categoryId})
        }
        if(category !== undefined) categoryIcon = category.icon 
        return ({
            key: point._id,
            position: point.position,
            popUpContent: (<div>
                           <Card
                             style={{ width: 300 }}
                             cover={
                               <img
                                 alt="Loading"
                                 src={point.image}
                               />
                             }
                             actions={[source]}
                           >
                             <Meta
                               avatar={<Avatar src= {categoryIcon} />}
                               title={point.name}
                               description={point.description}
                             />
                           </Card>

                           </div>),
       })
    })
  }

  // ***** Children events ***** //

  OnNameFilterChange = aFilter => {
    this.setState({ nameFilter: aFilter })
  }

  OnCategoryFilterChange = aFilter => {
    this.setState({ categoryFilter: aFilter })
  }

  onMapClick = (latlong) => {
    console.log(latlong)
  }

  // Add point

  saveFormRef = formRef => {
    this.formRef = formRef
  }

  onNewPoint = position => {
    const form = this.formRef.props.form;
    form.setFieldsValue(
      { position: position },
      () => this.setState( prevState => ({
        modal: {position: position},
        newPoint: !prevState.newPoint,
      }))
    )
  }

  handleAddPointConfirm = () => {
    this.setState(state => {
      const { modal } = state
      const newModal = Object.assign({}, modal)
      newModal.confirmLoading = true
      return newModal
    })

    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      //solo agregamos puntos de categorias locales
      //esto se podria hacer en el constructor de point
      //en backend pero aca en memoria es mas rapido (aunque mas sucio)
      const categoryId = this.props.categories.find( c =>{ return !c.extern && values.categoryName === c.title})._id
      const newPoint = {...values, 'categoryId':categoryId };
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

  render() {
    const { points, categories } = this.props
    const ourCategories = categories.filter(c => !c.extern)
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
          categories={ourCategories}
        />
        <Row id="Mapa">
          <Col>
            <ContextMainMap
              markers={this.getFilteredMarkers()}
              onClick={this.onMapClick}
              showMyPosition={false}
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
