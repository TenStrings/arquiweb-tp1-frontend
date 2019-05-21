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

const ContextLogin = withUserContext(withRouter(Login))
const ContextSignUp = withUserContext(SignUp)
const AuthenticatedNavigationMenu = withRouter(withUserContext(NavigationMenu))
const ContextBackofficePoints = withUserContext(BackofficePoints)
const ContextBackofficeCategories = withUserContext(BackofficeCategories)
const ContextBackofficeSuggestions = withUserContext(BackofficeSugCategories)

//rest en nuestro caso es solo path= pero hay mas atributos
//que se le pueden pasar a Route
/*
const FadingRoute = ({ component: Component, ...rest }) => (
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
    categories: [],
    suggestions: [],
    mocked_logedin: false
  }

  componentDidMount() {
    this.loadPointsFromAPI()
    this.loadCategoriesFromAPI()
    this.loadSuggestionsFromAPI()
  }

  loadPointsFromAPI = () => {
    poiAPI.get()
    .then(res => {
      this.setState({ points: res.data });
    });
  }

  loadCategoriesFromAPI = () => {
    categoriesAPI.get()
    .then(res => {
      this.setState({ categories: res.data });
    })
  }

  loadSuggestionsFromAPI = () => {
    suggestionsAPI.get()
    .then(res => {
      this.setState({ suggestions: res.data });
    })
  }

  onPointChange = () => {
    this.loadPointsFromAPI()
  }

  onCategoryChange = () => {
    this.loadCategoriesFromAPI()
    this.loadPointsFromAPI()
  }
  onNewSuggestion = () => {
    this.loadSuggestionsFromAPI()
  }
  onSuggestionSolved = was_accepted => {
    this.loadSuggestionsFromAPI()
    if (was_accepted) this.loadCategoriesFromAPI()
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
                  categories={categories}
                  notifyCategoryChange={ this.onCategoryChange }
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
