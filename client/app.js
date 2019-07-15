import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import {AppContainer, setConfig} from "react-hot-loader"

setConfig({
    reloadHooks: false,
});
const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate
const render = Component => {
    renderMethod(
        <AppContainer>
            <Component/>
        </AppContainer>,
        root
    )
}
render(App)
//(<App/>, document.getElementById("root"))

if (module.hot) {
    module.hot.accept('./App.jsx', () => {
        const NextApp = require('./App.jsx').default
        ReactDOM.hydrate(<NextApp/>, document.getElementById("root"))
    });
}