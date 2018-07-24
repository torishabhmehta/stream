import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Controller from './Controller';
import Player from './Player';

class Main extends Component {
   render() {
      return (
         <Router>
            <div>
               <Switch>
                  <Route exact path='/controller' component={Controller} />
                  <Route exact path='/player' component={Player} />
               </Switch>
            </div>
         </Router>
      );
   }
}
export default Main;
