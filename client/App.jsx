import React from 'react'
import { hot } from 'react-hot-loader/root';
//使用hot仅适用于模块exports，而不是模块imports。
/*export default class App extends React.Component {

    render() {
        return (
            <div>this is appwq!</div>
        )
    }
}*/
const App = () => <div>Hello Worldwqsds12333!</div>;
export default hot(App);