import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { 
      name: 'Arto Hellas', 
      number: '040-1234567'
    },
    { 
      name: 'Ada Lovelace',
      number: '47-47474747'
    }
  ]) 

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
    const nameExists = newName ? persons.some(person => person.name === newName) : false;

    if (nameExists){
      alert(`${newName} is already added to phonebook`);
    } else {
      const contactObject = {
        name: newName,
        number: newNumber
      }
    setPersons(persons.concat(contactObject))
    setNewName('')
    setNewNumber('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
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
      <h2>Numbers</h2>
      {persons.map ((person, index) => 
        <p key={index}>{person.name + ' ' + person.number}</p>
      )}
    </div>
  )
}

export default App