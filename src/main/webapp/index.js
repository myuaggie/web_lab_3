import React from 'react'
import { render } from 'react-dom'
import Wrong from './modules/selfTable'

import { Router, Route, hashHistory } from 'react-router'
import App from './modules/app'



render((
    <Router history={hashHistory}>
        <Route path="/" component={App}/>
        <Route path="/wrongset" component={Wrong}/>
    </Router>
), document.getElementById('app'))
