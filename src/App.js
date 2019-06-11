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
import { adaptExternData} from './extern_apis';


const ContextLogin = withUserContext(withRouter(Login))
const ContextSignUp = withUserContext(SignUp)
const AuthenticatedNavigationMenu = withRouter(withUserContext(NavigationMenu))
const ContextBackofficePoints = withUserContext(BackofficePoints)
const ContextBackofficeCategories = withUserContext(BackofficeCategories)
const ContextBackofficeSuggestions = withUserContext(BackofficeSugCategories)

class App extends Component {

  state = {
    points: [],
    categories: [],
    suggestions: [],
    mocked_logedin: false
  }

  //Data Loading
  componentDidMount() {
    this.loadOurPoints()
    this.loadOurCategories()
    this.loadOurSuggestions()
    this.loadExternData()
  }

  loadOurPoints = () => {
    poiAPI.get()
    .then(res => {
      let our_points = res.data.map(p => ({...p, extern:false}))
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

  //TODO HACER REFRESH DEL EXTERN DATA CADA X SEGUNDOS
  loadExternData = async() => {
    let extern = await adaptExternData()
    console.log("extern data")
    console.log(extern)
    this.setState(prevState => ({
      points: prevState.points.concat(extern.points),
      categories: prevState.categories.concat(extern.categories)
    }));
  }


  //**** Data reloading triggers  ****/
  onPointChange = () => {
    this.loadOurPoints()
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

  //Log In
  onLogIn = () => this.setState({mocked_logedin:true})
  onLogOut = () => this.setState({mocked_logedin:false})

  render() {
    const { points, categories, suggestions } = this.state;
    const visiblePoints = points.filter(p => p.visible)
    const ourVisiblePoints = visiblePoints.filter(p => !p.extern)
    const visibleCategories = categories.filter(c => c.visible)

    return (
      <UserProvider>
        <Router>

          <AuthenticatedNavigationMenu
             mockedUser={this.state.mocked_logedin}
             categories={categories}
             notifyLogOut={this.onLogOut}
             notifyNewSuggestion={this.onNewSuggestion}
          />

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
                  points={ourVisiblePoints}
                  categories={categories} //ver por q es necesario
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
