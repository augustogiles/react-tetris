import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Tetris from './components/Tetris';

const App = () => (
  <Tetris />
);

ReactDOM.render(<App />, document.querySelector('#root'));