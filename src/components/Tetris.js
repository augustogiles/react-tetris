import React, {useState} from 'react';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

import { createStage, checkCollision } from '../gameHelpers';
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

const DROP_TIME_FORMULA = (level) => 1000 / (level + 1) + 200;
let localScore = localStorage.getItem("bestScore") || 0 ;

const Tetris = () => {

  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    rowsCleared
  ); 

  const movePlayer = dir => {
    if(!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  }
  const startGame = () => {
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setRows(0);
    setLevel(0);
    setScore(0);
  }

  const drop = () => {
    if(rows > (level + 1) * 10){
      setLevel(prev => prev + 1);
      setDropTime(DROP_TIME_FORMULA(level));
    }

    if(!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false })
    }else{
      if(player.pos.y < 1){
        if(score > localScore) {
          localScore = score;
          localStorage.setItem("bestScore", localScore);
        }

        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos( {x: 0, y: 0, collided: true} )
    }
  }

  const keyUp = ({ keyCode }) => {
    if(!gameOver){
      if(keyCode === 40){
        setDropTime(DROP_TIME_FORMULA(level));
      }
    }
  }

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  }

  const move = ( event ) => {
    let {keyCode} = event;
    event.preventDefault();
    
    if(!gameOver){
      if(keyCode === 37){
        movePlayer(-1);
      } else if(keyCode === 39){
        movePlayer(1);
      } else if(keyCode === 40){
        dropPlayer();
      } else if(keyCode === 38){
        playerRotate(stage, 1);
      } else if (keyCode === 32){
        dropPlayer();
      }
    }
  }

  useInterval(() => {
    drop();
  }, dropTime);

  return (
    <StyledTetrisWrapper 
      role="button" 
      tabIndex="0" 
      onKeyDown={e => move(e)} 
      onKeyUp={keyUp}>
      <StyledTetris>
        <Stage className="stage" stage={stage} />
        <aside>
          {gameOver ? 
            (
              <Display gameOver={gameOver} text="GameOver" />
            )
            :
            (
              <div>
                <Display text={`Best Score: ${localScore}`} />
                <Display text={`Score: ${score}`} />
                <Display text={`Rows: ${rows}`} />
                <Display text={`Level: ${level}`} />
              </div>
            )}
          <StartButton callback={ startGame } />
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
}

export default Tetris;