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
    setInterval(() => {
      this.loadPoints()
      this.loadCategories()
    }, 20000);
  }

  loadPoints = async () => {
    const intern_points = await poiAPI.get()
    poiAPI.get_extern().then(res => {
      this.setState({ points: intern_points.concat(res) });
    });
  }

  loadCategories = async () => {
    const intern_categories = await categoriesAPI.get()
    categoriesAPI.get_extern().then(res => {
      this.setState({ categories: intern_categories.concat(res) });
    })
  }

  loadSuggestions = () => {
    suggestionsAPI.get()
    .then(res => {
      this.setState({ suggestions: res });
    })
  }

  //**** Data reloading triggers  ****/
  onPointChange = () => {
    this.loadPoints()
    this.loadCategories()
  }

  onCategoryChange = () => {
    this.loadPoints()
    this.loadCategories()
  }

  onNewSuggestion = () => {
    this.loadSuggestions()
  }

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
            categories={ourCategories}
            suggestions={suggestions}
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
