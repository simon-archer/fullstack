import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountryData = ({ country }) => (
  <div>
    <h2>{country.name}</h2>
    <p>Capital: {country.capital}</p>
    <p>Population: {country.population}</p>
    <img src={country.flag} alt={`flag of ${country.name}`} width="100" />
  </div>
);

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then(response => {
      setCountries(response.data)
    })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  let content;

  if (filteredCountries.length > 10) 
  {
    content = <p>Too many matches, specify another filter</p>
  } else if (filteredCountries.length > 1) 
  {
    content = filteredCountries.map(country => <p key={country.cca3}>{country.name.common}</p>)
  } else if (filteredCountries.length === 1) 
  {
    content = <CountryData country={filteredCountries[0]} />
  }

  return (
    <div>
      <div>
        Find countries: <input value={search} onChange={handleSearchChange} />
      </div>
      {content}
    </div>
  )
}

export default App;
