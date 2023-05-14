import { useState, useEffect } from 'react'
import axios from 'axios'
import contactService from './services/contacts'

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
    event.preventDefault();
    const nameExists = newName ? people.some(person => person.name === newName) : false;
  
    if (nameExists){
      alert(`${newName} is already added to phonebook`);
    } else {
      const contactObject = {
        name: newName,
        number: newNumber,
        id: people.length + 1
      }
      contactService.create(contactObject)
      .then(response => {
        setPeople(people.concat(contactObject))
        setNewName('')
        setNewNumber('')
      })
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

const People = ({ people, deleteContact }) => {

  if (!people) return

  console.log(people)

  return (
      <>
        {people .map(person => <p key={person.id}>{person.name + ' ' + person.number} <button onClick={() => deleteContact(person)}>Delete</button></p>)}
      </>
    )
  }
  

const App = () => {
  const [filterSearch, setFilterSearch] = useState("")
  const [people, setPeople] = useState([])
 
  useEffect(() => {
    contactService
      .getAll()
      .then(initialContacts => {
        setPeople(initialContacts)
      })
  }, [])

  const deleteContact = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      contactService
        .deleteContact(person.id)
        .then(() => {
          setPeople(people.filter((p) => p.id !== person.id));
        })
        .catch((error) => {
          console.error('There was an error!', error);
        })
    }
}

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
      <People people={sortedPeople()} deleteContact={deleteContact}/>
    </div>
  )
}

export default App

