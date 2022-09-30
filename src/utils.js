import dayjs from "dayjs"; 

const FORMAT_TIME_STRING = 'HH:mm';

export function getUrl(lat, lon, endPoint, apiKey) {
    return `${endPoint}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&cnt=9`;
  }

export function getCurrentPosition() {
    if(!window.navigator || !window.navigator.geolocation) {
        throw new Error ("Oopps! Geolocation API not suppted")
    }
    return new Promise ((resolve, reject) => 
    window.navigator.geolocation.getCurrentPosition(resolve, reject));
}

function getVisibility (metrCount) {
    return (metrCount / 1000).toFixed()
}

function getWeatherData (rawData) {
    const {visibility, main, weather, wind, dl_txt} = rawData
    const {humidity, temp} = main
     return {
        date: dayjs(dl_txt).toDate(),
        visibility: `${getVisibility(visibility)}/km `,
        humidity: `${humidity}%`,
        wind: `${Math.ceil(wind.speed)}m/sec `,
        temp: `${Math.ceil(temp)}°C`,
        icon: weather.at(0).icon,
        description: weather.at(0).description ,
        shortDescription: weather.at(0).main
     }

}

export function transformWeatherData (rawData) {
    const {city, list} = rawData
    const today = list.at(0)
    const tomorrow = list.at(-1)

    return {
        city: city.name,
        sunrise: dayjs
            .unix(city.sunrise)
            .format(FORMAT_TIME_STRING),
    
        sunset: dayjs
            .unix(city.sunset)
            .format(FORMAT_TIME_STRING),
    
        today: getWeatherData(today),
        tomorrow: getWeatherData(tomorrow),
      }
}