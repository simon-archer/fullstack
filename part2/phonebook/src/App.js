import { useState, useEffect } from 'react'
import contactService from './services/contacts'
import Notification from './components/Notification'

const Filter = ({ filterSearch, setFilterSearch }) => {

  const handleFilterInput = (event) => {
    console.log(event.target.value)
    setFilterSearch(event.target.value)
  }
  return (
    <div>
      Filter shown with: <input
        value={filterSearch}
        onChange={handleFilterInput}
      />
    </div>
  )
}

const PersonForm = ({ people, setPeople, setUserMessage, setMessageType }) => {
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

  const getIdByName = (name) => {
    const person = people.find(person => person.name === name)
    return person ? person.id : null
  }

  const addContact = (event) => {
    event.preventDefault()
    const nameExists = people.some(person => person.name === newName)

    if (nameExists) {
      const confirmResult = window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)
      if (confirmResult) {
        const personId = getIdByName(newName)
        contactService.update(personId,
          {
            name: newName,
            number: newNumber
          })
          .then(updatedPerson => {
            setPeople(people.map(person => person.id !== updatedPerson.id ? person : updatedPerson))
            setUserMessage(
              `${newName} number was updated`
            )
            setMessageType('userMessage')
            setTimeout(() => {
              setUserMessage(null)
            }, 5000)
          })
      }
    } else {
      const contactObject = {
        name: newName,
        number: newNumber,
      }
      contactService.create(contactObject)
        .then(response => {
          setPeople(people.concat(response))
          setNewName('')
          setNewNumber('')
          setUserMessage(
            `Added ${newName}`
          )
          setMessageType('userMessage')
          setTimeout(() => {
            setUserMessage(null)
          }, 5000)
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.error) {
            console.error(error.response.data.error)
            setUserMessage(error.response.data.error)
            setMessageType('errorMessage')
            setTimeout(() => {
              setUserMessage(null)
            }, 5000)
          }
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
      {people.map(person => <p key={person.id}>{person.name + ' ' + person.number} <button onClick={() => deleteContact(person)}>Delete</button></p>)}
    </>
  )
}


const App = () => {
  const [filterSearch, setFilterSearch] = useState("")
  const [people, setPeople] = useState([])
  const [userMessage, setUserMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

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
          setPeople(people.filter((p) => p.id !== person.id))
          setUserMessage(`Deleted ${person.name}`)
          setMessageType('userMessage')
        })
        .catch((error) => {
          setUserMessage(`Information of ${person.name} has already been removed from server`)
          setMessageType('errorMessage')
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
      <Notification message={userMessage} type={messageType} />
      <Filter filterSearch={filterSearch} setFilterSearch={setFilterSearch} people={people} />
      <h2>Add a new contact</h2>
      <PersonForm people={people} setPeople={setPeople} setUserMessage={setUserMessage} setMessageType={setMessageType} />
      <h2>Numbers</h2>
      <People people={sortedPeople()} deleteContact={deleteContact} />
    </div>
  )
}

export default App

