import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';

import MainMap from '../components/MainMap';
import POIFilter from '../components/POIFilter'
import CategoryFilter from '../components/CategoryFilter'


class Home extends Component {
  NoFilter = function(points){return points}

  //TODO FilterProvider component to tidy up
  state = {
    nameFilter: this.NoFilter,
    categoryFilter : this.NoFilter,
  }

  getFilteredMarkers =  function() {
    const { points } = this.props
    const { nameFilter, categoryFilter} = this.state
    const filteredPoints = nameFilter(categoryFilter(points))
    return filteredPoints.map(point => ({
          position: point.position,
          popUpContent: (<div> Name: {point.name} <br/> Description: {point.description}</div>),
          key: point.id,
    }))
  }

  onMapClick = (latlong) => {
    console.log(latlong)
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

  render() {
    const { points, categories} = this.props

    return (
      <div className="App">
          <Row id="Mapa">
              <Col>
                  <MainMap
                  style={{ height: '600px' }}
                  markers={this.getFilteredMarkers()}
                  onClick={this.onMapClick}
                  ShowMyPosition={true}
                  />
              </Col>
          </Row>

          <Row style={{ background: '#ECECEC'}}> <hr className="my-2" /> </Row>

          <Row id="Filtros"
               style={{ background: '#ECECEC', padding: '20px' }}
               type="flex"
          >
              <Col offset={1}>
                  <Card
                      title="Match if name starts with..."
                      style={{ width: 300 }}
                  >
                      <POIFilter onChange={this.setNameFilter} poi={points}></POIFilter>
                  </Card>
              </Col>

              <Col offset={1}>
                  <Card
                    title="Match if belongs to any of the listed categories."
                    style={{ width: 500 }}
                  >
                      <CategoryFilter
                        key={categories}
                        updateMapWith={this.setCategoryFilter}
                        categories={categories}
                      />
                  </Card>
              </Col>
          </Row>
      </div>
    );

  }
}

/*
  handleCategorySubmit  = event => {
    event.preventDefault();
    const name = event.target[0].value
    this.setState(state => {
      let {categories} = state
      return { categories: [ ...categories, {title: name , icon: "idk4" }] }
    });
  }

  handlePointSubmit = (event) => {
    event.preventDefault();
    const name = event.target[0].value
    const lat = event.target[1].value
    const long = event.target[2].value
    alert(name)

    this.setState(state => {
      let {points} = state
      let {currentPointId} = state
      return { points: [ ...points, {name: name , position: { lat: lat, lng: long}, id: currentPointId + 1 }], currentPointId: currentPointId + 1 }
    });
  }
*/
/*
<Footer>
    <form onSubmit={this.handleCategorySubmit}>
      <input type="text" name="categoryName" placeholder="Category name" />
      <input type="submit" value="Add category" />
    </form>

    <form onSubmit={this.handlePointSubmit}>
      <input type="text" name="name" placeholder="Point name" />
      <input type="number" name="name" placeholder="latitude" />
      <input type="number" name="name" placeholder="longitude" />
      <input type="submit" value="Add Point" />
    </form>
</Footer>

*/

export default Home
