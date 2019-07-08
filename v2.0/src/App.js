import React, { Component } from 'react';
import Helmet from 'react-helmet';
import {Switch, Route} from 'react-router-dom';

import './assets/css/style.css';

import HomePage from './Components/Pages/HomePage'
import ActionsPage from './Components/Pages/ActionsPage'
import OneActionPage from './Components/Pages/OneActionPage'
import AboutUsPage from './Components/Pages/AboutUsPage'
import StoriesPage from './Components/Pages/StoriesPage'
import LoginPage from './Components/Pages/LoginPage'
import EventsPage from './Components/Pages/EventsPage'
import OneEventPage from './Components/Pages/OneEventPage'
import ProfilePage from './Components/Pages/ProfilePage'

class App extends Component {
	render() {
		return (
			<div>
				<Helmet>
					<meta charset="UTF-8" />
					<title>Mass Energize</title>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
				</Helmet>
				<Switch>
					<Route exact path="/" component={HomePage} />
					<Route path="/home" component={HomePage} />
					<Route exact path="/actions" component={ActionsPage}/>
					<Route path="/aboutus" component={AboutUsPage}/>
					<Route path="/actions/:id" component={OneActionPage}/>
					<Route path="/stories" component={StoriesPage}/>
					<Route exact path="/events" component={EventsPage}/>
					<Route path="/events/:id" component={OneEventPage}/>
					<Route path="/login" component={LoginPage}/>
					<Route path="/profile" component={ProfilePage}/>
					{/*<Route path="/contact" component={Contact} /> */}
					<Route component={()=>
						<div>
							FOUR OR FOR: PAGE NOT FOUND
						</div>
					}/>
				</Switch>
			</div>
		);
	}
}
export default App;
