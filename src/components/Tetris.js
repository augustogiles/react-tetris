import React from 'react';

import Stage from './Stage'
import Display from './Display'
import StartButton from './StartButton'

const Tetris = ({ callback }) => {
  return (
    <div>
      <Stage />
      <aside>
        <Display text="Score" />
        <Display text="Rows" />
        <Display text="Level" />
      </aside>
      <StartButton />
    </div>
  );
}

export default Tetris;