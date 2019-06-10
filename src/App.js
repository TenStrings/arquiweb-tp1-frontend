import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {withRouter} from 'react-router-dom'
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import BackofficePoints from './pages/BackofficePoints';
import BackofficeCategories from './pages/BackofficeCategories';
import BackofficeSugCategories from './pages/BackofficeSugCategories';
import NavigationMenu from './components/NavigationMenu';

import { withUserContext } from './context/withUserContext';
import UserProvider from './context/UserProvider';
import { poiAPI, categoriesAPI, suggestionsAPI } from './api';
import { lucasAPI, guidoAPI} from './extern_apis';


const ContextLogin = withUserContext(withRouter(Login))
const ContextSignUp = withUserContext(SignUp)
const AuthenticatedNavigationMenu = withRouter(withUserContext(NavigationMenu))
const ContextBackofficePoints = withUserContext(BackofficePoints)
const ContextBackofficeCategories = withUserContext(BackofficeCategories)
const ContextBackofficeSuggestions = withUserContext(BackofficeSugCategories)

class App extends Component {

  state = {
    loginModalShow: false,
    points: [],
    categories: [],
    suggestions: [],
    mocked_logedin: false
  }

  componentDidMount() {
    this.loadOurPoints()
    this.loadOurCategories()
    this.loadOurSuggestions()
    this.loadExternData()
  }

  loadExternData = async() => {
    let extern_points = []
    let extern_categories = []

    let guido_points = await guidoAPI.getPoints()
    guido_points.forEach(p => {
        let extern_point = {
            _id: p.id,
            position: {'lat':p.lat,'lng':p.long},
            name: p.name,
            description: p.description,
            image:p.img,
            categoryName:p.category.name,
            visible: true,
            extern: true
        }
        extern_points.push(extern_point)
    })

    let lucas_points = await lucasAPI.getPoints()
    lucas_points.forEach(p => {
        let extern_point = {
            _id: p.id,
            position: {'lat':p.latitude,'lng':p.longitude},
            name: p.title,
            description: p.description,
            image:p.imageUrl,
            categoryName:p.category.name,
            visible: true,
            extern: true
        }
        extern_points.push(extern_point)
    })

    let guido_categories = await guidoAPI.getCategories()
    guido_categories.forEach(c => {
        if (c.status === "APPROVED"){
            let extern_category = {
                _id: c.id,
                title: c.name,
                icon: c.icon,
                visible: true,
                extern: true
            }
            extern_categories.push(extern_category)
        }
    })

    let lucas_categories = await lucasAPI.getCategories()
    lucas_categories.forEach(c => {
        if (c.state === "APPROVED"){
            let extern_category = {
                _id: c.id,
                title: c.name,
                icon: c.logoUrl,
                visible: true,
                extern: true
            }
            extern_categories.push(extern_category)
        }
    })

    this.setState(prevState => ({
      points: {...prevState.points, ...extern_points},
      categories: {...prevState.categories, ...extern_categories}
    }))

  }

  loadOurPoints = () => {
    poiAPI.get()
    .then(res => {
      let our_points = []
      res.data.map(p => our_points.push({...p, extern:false}))
      this.setState({ points: our_points });
    });
  }

  loadOurCategories = () => {
    categoriesAPI.get()
    .then(res => {
      let our_categories = []
      res.data.map(c => our_categories.push({...c, extern:false}))
      this.setState({ categories: our_categories });
    })
  }

  loadOurSuggestions = () => {
    suggestionsAPI.get()
    .then(res => {
      let our_suggestions = []
      res.data.map(s => our_suggestions.push({...s, extern:false}))
      this.setState({ suggestions: our_suggestions });
    })
  }

  onPointChange = () => {
    this.loadOurPoints()
    this.loadOurCategories()
  }

  onCategoryChange = () => {
    this.loadOurPoints()
    this.loadOurCategories()
  }
  onNewSuggestion = () => {
    this.loadOurSuggestions()
  }
  onSuggestionSolved = was_accepted => {
    this.loadOurSuggestions()
    if (was_accepted) this.loadOurCategories()
  }

  onLogIn = () => this.setState({mocked_logedin:true})
  onLogOut = () => this.setState({mocked_logedin:false})

  render() {
    const { points, categories, suggestions } = this.state;
    const visiblePoints = points.filter(p => p.visible)
    const visibleCategories = categories.filter(c => c.visible)

    return (
      <UserProvider>
        <Router>
          <AuthenticatedNavigationMenu mockedUser={this.state.mocked_logedin} notifyLogOut={this.onLogOut}
                                       categories={categories} notifyNewSuggestion={this.onNewSuggestion}/>
          <Switch>

            <Route exact path='/' render={props => (
              <Home
                mockedUser={this.state.mocked_logedin}
                points={visiblePoints}
                categories={visibleCategories}
                notifyPointChange={this.onPointChange}
              />
            )} />

            <Route path="/backoffice_points" render={ props => (
                <ContextBackofficePoints
                  points={points}
                  categories={categories}
                  notifyPointChange={this.onPointChange}
                />
              )} />

            <Route path='/backoffice_approved_categories' render={ props => (
                <ContextBackofficeCategories
                  key={categories}
                  categories={categories}
                  notifyCategoryChange={this.onCategoryChange}
                />
            )}/>

            <Route path='/backoffice_suggested_categories' render={ props => (
                <ContextBackofficeSuggestions
                  suggestions={suggestions}
                  notifySuggestionSolved={ this.onSuggestionSolved }
                />
            )}/>

            <Route path='/login' render={props => <ContextLogin notifyLogIn={this.onLogIn}/> } />
            <Route path='/register' component={ContextSignUp} />

          </Switch>
        </Router>
      </UserProvider>
    );
  }
}

export default App;
