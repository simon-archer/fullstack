import logo from './logo.svg';
import './App.css';

import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    console.log('Clicked')
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    console.log('Clicked')
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    console.log('Clicked')
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={handleGoodClick}>good</button>
      <button onClick={handleNeutralClick}>neutral</button>
      <button onClick={handleBadClick}>bad</button>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {good + neutral + bad}</p>
      <p>average {(good + neutral + bad)/3} </p>
      <p>positive {good / (good + neutral + bad)}</p>
    </div>
  )
}

export default App