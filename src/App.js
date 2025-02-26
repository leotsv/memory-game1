import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Card from './components/Card';

const cardImages = [
  { src: "🐶", matched: false },
  { src: "🐱", matched: false },
  { src: "🐭", matched: false },
  { src: "🐹", matched: false },
  { src: "🐰", matched: false },
  { src: "🦊", matched: false },
  { src: "🐻", matched: false },
  { src: "🐼", matched: false }
];

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://memory-game-env.eba-q2fxrmvr.us-east-1.elasticbeanstalk.com'  // AWS URL
  : 'http://localhost:5000/api';  // Local development         // Development backend URL

function App() {
  console.log("App is rendering");
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [topScores, setTopScores] = useState([]);

  // shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));
    
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setGameStartTime(Date.now());
  };

  // handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            }
            return card;
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  };

  // start game automatically
  useEffect(() => {
    shuffleCards();
  }, []);

  // Wrap getTopScores in useCallback
  const getTopScores = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/scores/top`);
      if (response.ok) {
        const scores = await response.json();
        setTopScores(scores);
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  }, [setTopScores]);

  // saveScore can now use getTopScores as a stable dependency
  const saveScore = useCallback(async (turns, timeInSeconds) => {
    const playerName = prompt("Game Complete! Enter your name:");
    if (playerName) {
      try {
        const response = await fetch(`${API_URL}/api/scores`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playerName,
            turns,
            timeInSeconds
          })
        });
        if (response.ok) {
          alert("Score saved successfully!");
          getTopScores();
        }
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
  }, [getTopScores]);

  // Then use it in useEffect
  useEffect(() => {
    const allMatched = cards.every(card => card.matched);
    if (allMatched && cards.length > 0) {
      const timeInSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
      saveScore(turns, timeInSeconds);
    }
  }, [cards, gameStartTime, turns, saveScore]);

  // Add this useEffect to load scores when component mounts
  useEffect(() => {
    getTopScores();
  }, [getTopScores]);

  return (
    <div className="App" style={{ backgroundColor: '#1b1523', minHeight: '100vh', padding: '20px' }}>
      <h1>Memory Game 4</h1>
      <button onClick={shuffleCards}>New Game</button>
      <button onClick={getTopScores}>Refresh Scores</button>
      
      <div className="card-grid">
        {cards.map(card => (
          <Card 
            key={card.id} 
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <p>Turns: {turns}</p>
      
      {/* Add this section to display top scores */}
      <div className="scores-section">
        <h2>Top Scores</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {topScores.map((score, index) => (
            <li key={score.id}>
              {index + 1}. {score.playerName} - {score.turns} turns in {score.timeInSeconds}s
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App; 