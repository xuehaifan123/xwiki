import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import SortModal from './pages/sortModal';
// import { ConfigProvider } from 'antd';
// import zhCN from 'antd/es/locale/zh_CN';
import 'antd/dist/antd.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SortModal />
      </div>
    );
  }
}

export default App;
