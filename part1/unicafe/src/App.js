import { useState } from 'react'

const GetAnecdote = ({anecdotes, selected}) => {
  return (
    <>
      <p>{anecdotes}</p>
    </>
  )
}


// const GetAnecdote = (props) => {
//   const [anecdotes, selected] = props
//   return (
//     <>
//       <p>{anecdotes[selected]}</p>
//     </>
//   )
// }
const VoteClick = ({votes, incrementVote, selected}) => {
  return (
    <>
      <p>Has {votes[selected]} votes</p>
      <button onClick={incrementVote}>Vote</button>
    </>
    )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const incrementVote = (props) => {
    const newVotes = [... votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  const mostVotedIndex = () => {
    return votes.indexOf(Math.max(...votes))
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <GetAnecdote anecdotes={anecdotes[selected]}/>
      <VoteClick votes={votes} incrementVote={incrementVote} selected={selected} />
      <button onClick={handleClick}>Next Anecdote</button>
      <h1>Anecdote with most votes</h1>
      <GetAnecdote anecdotes={anecdotes[mostVotedIndex()]} />
    </div>
  )
}

export default App