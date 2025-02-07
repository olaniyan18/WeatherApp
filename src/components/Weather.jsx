/** @format */

import React, { useState } from "react";
import styles from "./weather.module.css";
import axios from "axios";

export default function Weather() {
  const key = "a30b02951a5bc676aedd9b981048ed77";
  const [error, setError] = useState(null);
  const [isInput, setIsInput] = useState("");
  const [isName, setIsName] = useState(null);
  const [forecast, setForecast] = useState([]);

  async function Submit(e) {
    e.preventDefault();
    try {
      const res = await axios
        .get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${isInput}&limit=1&appid=${key}`
        )
        .then((response) => {
          console.log(response);
          const lat = response.data[0].lat;
          const lon = response.data[0].lon;
          const name = response.data[0].name;
          const weatherRes = axios
            .get(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
            )
            .then((weatherres) => {
              console.log(weatherres.data);
              setIsName(name);
              const filteredData = weatherres.data.list.filter(
                (_, index) => index % 8 === 0
              );
              setForecast(filteredData);
              setError(null);
            });
        });
    } catch (err) {
      setError("Failed to fetch weather data. Check API key.");
      console.error(err);
    }
  }

  function handleChange(e) {
    setIsInput(e.target.value);
  }

  return (
    <section>
      <h1>Weather App</h1>
      <form onClick={Submit}>
        <div className={styles.weather}>
          <div className={styles.input}>
            <input
              type='text'
              name='input'
              id=''
              value={isInput}
              placeholder='Enter city name'
              onChange={(e) => handleChange(e)}
            />
            <input type='submit' value='Forecast' />
          </div>
          {isName && <h2>{isName}</h2>}
          {forecast.length > 0 && (
            <div className={styles.today}>
              <span>{forecast[0].weather[0].description}</span>
              <p>Today: {forecast[0].main.temp}°C</p>
            </div>
          )}
          <div className={styles.forecast}>
            {forecast.slice(1).map((item, index) => (
              <div key={index} className={styles.day}>
                <h2 className={styles.date}>
                  {new Date(item.dt_txt).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </h2>
                <span>{item.weather[0].description}</span>
                <p>{item.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      </form>
    </section>
  );
}
