import logo from './logo.svg';
import './App.css';

import { useState } from 'react'

const Statistics = (props) => {
  const {good, neutral, bad} = props
  const total = good + neutral + bad
  const average = total / 3
  const positivePercentage = good / total
  return (
    <>
    <p>all {total}</p>
    <p>average {average}</p>
    <p>positive {positivePercentage}</p>
    </>
  )
}

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
      <Statistics good={good} neutral={neutral} bad={bad}/>
      {/* <p>bad {bad}</p>
      <p>all {Statistics.total}</p>
      <p>average {Statistics.average}</p>
      <p>positive {Statistics.positivePercentage}</p> */}
    </div>
  )
}

export default App