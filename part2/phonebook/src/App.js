// import { useState } from 'react'

// const Filter = ({filterSearch, handleFilterInput}) => {
//   return (
//     <div>
//       Filter shown with: <input
//         value={filterSearch}
//         onChange={handleFilterInput}
//       />
//     </div>
//   )
// }

// const PersonForm = ({people, setPeople}) => {
//   const [newName, setNewName] = useState('')
//   const [newNumber, setNewNumber] = useState('')

//   const handleNameInput = (event) => {
//     console.log(event.target.value)
//     setNewName(event.target.value)
//   }

//   const handleNumberInput = (event) => {
//     console.log(event.target.value)
//     setNewNumber(event.target.value)
//   }
  
//   const addContact = (event) => {
//     event.preventDefault()
//     const nameExists = newName ? people.some(person => person.name === newName) : false;

//     if (nameExists){
//       alert(`${newName} is already added to phonebook`);
//     } else {
//       const contactObject = {
//         name: newName,
//         number: newNumber,
//         id: people.length + 1
//       }
//     setPeople(people.concat(contactObject))
//     setNewName('')
//     setNewNumber('')
//     }
    
//   }

//   return (
//     <form onSubmit={addContact}>
//         <div>
//           Name: <input 
//             value={newName}
//             onChange={handleNameInput}
//           />  
//         </div>
//         <div>
//           Number: <input 
//             value={newNumber}
//             onChange={handleNumberInput}
//           />    
//         </div>
//         <div>
//           <button type="submit">Add</button>
//         </div>
//       </form>
//   )
// }

// const People = ({people, filterSearch}) => {
//   const peopleToShow = filterSearch ? people.filter(person => person.name.toLowerCase().includes(filterSearch.toLowerCase())) : people
  
//   return (
//     <>
//       {peopleToShow.map (person => 
//         <p key={person.id}>{person.name + ' ' + person.number}</p>
//       )}
//     </>
//     ) 
//   }
// const App = () => {
//   const [people, setPeople] = useState([
//     { name: 'Arto Hellas', number: '040-123456', id: 1 },
//     { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
//     { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
//     { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
//   ])

//   const [filterSearch, setFilterSearch] = useState('')

//   const handleFilterInput = (event) => {
//     console.log(event.target.value)
//     setFilterSearch(event.target.value)
//   }

//   return (
//     <div>
//       <h2>Phonebook</h2>
//       <Filter filterSearch={filterSearch} handleFilterInput={handleFilterInput} people={people} />
//       <h2>Add a new contact</h2>
//       <PersonForm people={people} setPeople={setPeople}/>
//       <h2>Numbers</h2>
//       <People people={people} filterSearch={filterSearch} />
//     </div>
//   )
// }

// export default App

import { useState } from 'react'

const Filter = ({filterSearch, setFilterSearch}) => {

  const handleFilterInput = (event) => {
    console.log(event.target.value)
    setFilterSearch(event.target.value)
  }
  console.log("here?")
  return (
    <div>
      Filter shown with: <input
        value={filterSearch}
        onChange={handleFilterInput}
      />
    </div>
  )
}

const PersonForm = ({people, setPeople}) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameInput = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberInput = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  
  const addContact = (event) => {
    event.preventDefault()
    const nameExists = newName ? people.some(person => person.name === newName) : false;

    if (nameExists){
      alert(`${newName} is already added to phonebook`);
    } else {
      const contactObject = {
        name: newName,
        number: newNumber,
        id: people.length + 1
      }
      setPeople(people.concat(contactObject))
      setNewName('')
      setNewNumber('')
    }
  }

  return (
    <form onSubmit={addContact}>
        <div>
          Name: <input 
            value={newName}
            onChange={handleNameInput}
          />  
        </div>
        <div>
          Number: <input 
            value={newNumber}
            onChange={handleNumberInput}
          />    
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
  )
}

const People = ({ people }) => {

  if (!people) return

  console.log(people)

  return (
      <>
        {people .map(person => <p key={person.id}>{person.name + ' ' + person.number}</p>)}
      </>
    )
  }
  

const App = () => {
  const [filterSearch, setFilterSearch] = useState("")

  const [people, setPeople] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const sortedPeople = () => {
    if (!people) return []
    
    const sortedPeople = people.filter(person => {
      return person.name.toLowerCase().includes(filterSearch.toLowerCase())
    })
    console.log("sortedPeople: ", sortedPeople)
    
    return sortedPeople || []
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterSearch={filterSearch} setFilterSearch={setFilterSearch} people={people} />
      <h2>Add a new contact</h2>
      <PersonForm people={people} setPeople={setPeople}/>
      <h2>Numbers</h2>
      <People people={sortedPeople()} />
    </div>
  )
}

export default App

