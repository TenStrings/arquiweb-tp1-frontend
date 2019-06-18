import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { withRouter } from 'react-router-dom'
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
const ContextSignUp = withUserContext(withRouter(SignUp))
const AuthenticatedNavigationMenu = withRouter(withUserContext(NavigationMenu))
const ContextBackofficePoints = withUserContext(BackofficePoints)
const ContextBackofficeCategories = withUserContext(BackofficeCategories)
const ContextBackofficeSuggestions = withUserContext(BackofficeSugCategories)


class App extends Component {

  state = {
    points: [],
    categories: [],
    suggestions: [],
    loggedIn: false,
  }

  //Data Loading
  componentDidMount() {
    this.loadPoints()
    this.loadCategories()
    this.loadSuggestions()
    /*setInterval(() => {
      this.loadPoints()
      this.loadCategories()
    }, 20000);*/
  }

  loadPoints = () => {
    poiAPI.get()
    .then(res => {
      this.setState({ points: res });
    });
  }

  loadCategories = () => {
    categoriesAPI.get()
    .then(res => {
      this.setState({ categories: res });
    })
  }

  loadSuggestions = () => {
    suggestionsAPI.get()
    .then(res => {
      this.setState({ suggestions: res });
    })
  }

  //**** Data reloading triggers  ****/
  //TODO just reload by id instead of everything
  onPointChange = () => {
    this.loadPoints()
    this.loadCategories()
  }

  //TODO Just reload the modified category and points of that category
  onCategoryChange = () => {
    this.loadPoints()
    this.loadCategories()
  }

  //TODO this should add or remove the category from hidden_external_categories table in backend
  updateExternVisibility = (category) => {
    this.setState(prevState => {
      let the_category = prevState.categories.find(c => c._id === category._id)
      let index = prevState.categories.indexOf(the_category);
      let updated_categories = Object.assign([], prevState.categories)
      updated_categories[index] = category
      let updated_points = Object.assign([], prevState.points)
      updated_points = updated_points.map(p => ({ ...p, visible: category.visible }))
      return ({
        categories: updated_categories,
        points: updated_points
      })
    })
  }

  //TODO get only the new one by name
  onNewSuggestion = () => {
    this.loadSuggestions()
  }

  //TODO get only the new category by name
  onSuggestionSolved = was_accepted => {
    this.loadSuggestions()
    if (was_accepted) this.loadCategories()
  }

  //Log In
  onLogIn = () => this.setState({ loggedIn: true })
  onLogOut = () => this.setState({ loggedIn: false })

  render() {
    const { points, categories, suggestions } = this.state;
    const visiblePoints = points.filter(p => p.visible)
    const visibleCategories = categories.filter(c => c.visible)
    const ourPoints = points.filter(p => !p.extern)
    const ourCategories = categories.filter(c => !c.extern)
    return (
      <UserProvider>
        <Router>

          <AuthenticatedNavigationMenu
            categories={categories}
            notifyLogOut={this.onLogOut}
            notifyNewSuggestion={this.onNewSuggestion}
          />

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
                  points={ourPoints}
                  categories={ourCategories}
                  notifyPointChange={this.onPointChange}
                />
              )} />

            <Route path='/backoffice_approved_categories' render={ props => (
                <ContextBackofficeCategories
                  key={categories}
                  categories={categories}
                  notifyCategoryChange={this.onCategoryChange}
                  onExternVisibilyChange={this.updateExternVisibility}
                />
            )}/>

            <Route path='/backoffice_suggested_categories' render={ props => (
                <ContextBackofficeSuggestions
                  suggestions={suggestions}
                  notifySuggestionSolved={this.onSuggestionSolved}
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
