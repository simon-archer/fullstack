import logo from './logo.svg';
import './App.css';

import { useState } from 'react'

const StatisticsLine = (props) => {
  const {text, value} = props
  // const total = good + neutral + bad
  // const average = total / 3
  // const positivePercentage = good / total
  return (
    <tbody>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </tbody>
  )
}

const Statistics = (props) => {
  const {good, neutral, bad} = props
  const total = good + neutral + bad
  const average = (good - bad) / total
  const positivePercentage = good / total * 100 + '%'
if (total === 0) {
    return (
      <div>
      <h1>statistics</h1>
      <p>No feedback given</p>
      </div>
    )
  } {   
  return(
    <div>
      <h1>statistics</h1>
      <table>
      <StatisticsLine text="good" value ={good} />
      <StatisticsLine text="neutral" value ={neutral} />
      <StatisticsLine text="bad" value ={bad} />
      <StatisticsLine text="total" value ={total} />
      <StatisticsLine text="average" value ={average} />
      <StatisticsLine text="positive" value ={positivePercentage} />
      </table>
    </div>
  )
  }
}

const Button = (props) => {
  const {text, handler} = props
  return (
    <>
    <button onClick={handler}>{text}</button>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" handler={handleGoodClick} />
      <Button text="neutral" handler={handleNeutralClick} />
      <Button text="bad" handler={handleBadClick} />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App