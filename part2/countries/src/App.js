import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api_key = process.env.REACT_APP_API_KEY

const CountryData = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <p>Capital: {country.capital}</p>
    <p>Area: {country.area}</p>
    <p><b>Languages:</b></p>
    <ul>
      {Object.values(country.languages).map((language, index) => (
        <li key={index}>{language}</li>
      ))}
    </ul>
    <img src={country.flags.png} width="200" />
    <h3>Weather in {country.capital}</h3>
  </div>
);

const WeatherData = ({ weather }) => (
  <div>
    <p>Temperature: {weather.main.temp}°C</p>
    <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@1x.png`}></img>
  </div>
)

const App = () => {
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)
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

  useEffect(() => {
    if (filteredCountries.length === 1) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${filteredCountries[0].capital}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeather(response.data)
        })
    }
  }, [search])

  let content;

  if (filteredCountries.length > 10) 
  {
    content = <p>Too many matches, specify another filter</p>
  } else if (filteredCountries.length > 1) 
  {
    content = filteredCountries.map(country => <p key={country.cca3}>{country.name.common}<button onClick={() => setSearch(country.name.common)}>Show</button></p>)
  } else if (filteredCountries.length === 1) 
  {
    content = (
      <div>
        <CountryData country={filteredCountries[0]} />
        {weather && <WeatherData weather={weather} />}
      </div>
    )
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
