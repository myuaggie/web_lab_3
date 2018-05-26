import React, { Component }  from 'react'
import { hashHistory } from 'react-router'

let App = React.createClass({
    displayName: "App",
    enter: function () {
        hashHistory.push({
            pathname: '/wrongset',
        })
    },
    render: function () {
        return (
            <div>
                <div id="welcomePage">Welcome to wrongset,</div>
                <button id="welcomeBtn" onClick={this.enter}>enter</button>
            </div>
        )
    }
});

export default App;