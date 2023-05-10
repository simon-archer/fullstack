import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])


  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterSearch, setFilterSearch] = useState('')

  const handleNameInput = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberInput = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterInput = (event) => {
    console.log(event.target.value)
    setFilterSearch(event.target.value)
  }


  const addContact = (event) => {
    event.preventDefault()
    const nameExists = newName ? persons.some(person => person.name === newName) : false;

    if (nameExists){
      alert(`${newName} is already added to phonebook`);
    } else {
      const contactObject = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
      }
    setPersons(persons.concat(contactObject))
    setNewName('')
    setNewNumber('')
    }
  }

  const personsToShow = filterSearch ? persons.filter(person => person.name.toLowerCase().includes(filterSearch.toLowerCase())) : persons

  return (
    <div>
      <h2>Phonebook</h2>
        <div>
          Filter shown with: <input
            value={filterSearch}
            onChange={handleFilterInput}
          />
        </div>
      <h2>Add a new contact</h2>
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
      {personsToShow.map (person => 
        <p key={person.id}>{person.name + ' ' + person.number}</p>
      )}
    </div>
  )
}

export default App