import React, { Component } from 'react';
import './App.css';
import NavigationMenu from './components/NavigationMenu';
import Home from './pages/Home';
import Login from './pages/Login';
import BackofficePoints from './pages/BackofficePoints';
import BackofficeCategories from './pages/BackofficeCategories';
import BackofficeSugCategories from './pages/BackofficeSugCategories';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { withUserContext } from './context/withUserContext';
import UserProvider from './context/UserProvider';
import { poiAPI, categoriesAPI } from './api';
import axios from 'axios'


const ContextLogin = withUserContext(Login)
const AuthenticatedNavigationMenu = withUserContext(NavigationMenu)
const ContextBackofficePoints = withUserContext(BackofficePoints)

//rest en nuestro caso es solo path= pero hay mas atributos
//que se le pueden pasar a Route
/*const FadingRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    <FadeIn>
      <Component {...props}/>
    </FadeIn>
  )}/>
)*/

class App extends Component {

  state = {
    loginModalShow: false,
    points: [],
    categories: []
  }

  componentDidMount() {

    this.loadPointsFromAPI()
    this.loadCategoriesFromAPI()

  }

  loadPointsFromAPI = () => axios.get('http://localhost:4000/point')
    .then(res => {
      //console.log(res.data);
      this.setState({ points: res.data });
    });

  loadCategoriesFromAPI = () => axios.get('http://localhost:4000/category')
    .then(res => {
      //console.log(res.data);pointId
      this.setState({ categories: res.data });
    });

  onPointChange = () => {
    console.log("OnPointChange")
    this.loadPointsFromAPI()
  }

  getPoints = () => poiAPI.all().then(points => this.setState({ points: points }))

  getCategories = () => categoriesAPI.all().then(
    categories => this.setState({ categories: categories })
  )

  //<Route path='/backoffice_points' component={ContextBackofficePoints} />
  render() {
    const { points, categories } = this.state;
    const visiblePoints = points.filter(point => point.visible)
    return (
      <UserProvider>
        <Router>
          <AuthenticatedNavigationMenu />
          <Switch>
            {categories.length > 0 &&
            <Route exact path='/' render={
              props => (<Home {...props} points={visiblePoints} categories={categories} notifyPoiChange={this.onPointChange} />)
            } />}
            <Route path='/login' component={ContextLogin} />
            <Route path="/backoffice_points" render={(props) => (
              <ContextBackofficePoints {...props} key={points} notifyPointChanged={this.onPointChange} points={points} categories={categories} />)} />
            <Route path='/backoffice_approved_categories' component={BackofficeCategories} />
            <Route path='/backoffice_suggested_categories' component={BackofficeSugCategories} />

          </Switch>
        </Router>
      </UserProvider>
    );
  }
}

export default App;
