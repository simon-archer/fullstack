import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' },
    { name: 'Ada Lovelace'}
  ]) 

  const [newName, setNewName] = useState('')

  const handleInputChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const addContact = (event) => {
    event.preventDefault()
    const contactObject = {
      name: newName
    }

    setPersons(persons.concat(contactObject))
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          Name: <input 
            value={newName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="submit" onClick={addContact}>Add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map ((person, index) => 
        <p key={index}>{person.name}</p>
      )}
    </div>
  )
}

export default App