/* Global Variables */
const apiKey = "450e77b7b8ce4161a5327f34a501797f";
const zipCodeInput = document.querySelector('#zip');
const feelingInput = document.querySelector('#feelings');
const uiDate = document.getElementById('date');
const uiTemp = document.getElementById('temp');
const uiContent = document.getElementById('content');
const server = 'http://localhost:8080';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

//  Controls the sequence of actions after the generate button is clicked
function performAction(){
  const zipCode = zipCodeInput.value;
  const feeling = feelingInput.value;

  getWeather(zipCode)
  .then(function(weatherData){
    postData('/add', {...weatherData, feeling, date: newDate});
  })
  .then( retrieveProjectData )
  .then( updateUI )
  .catch(error => {console.log("error", error);});
}

// Functions called by performAction() in order
const getWeather = async function (zipCode){
  const url = `http://api.openweathermap.org/data/2.5/weather?zip=${zipCodeInput.value}&appid=${apiKey}`;
  const weatherRes = await fetch(url);

  try {
    const allData = await weatherRes.json();
    const weatherData = {
      temperature: allData.main.temp,
      description: allData.weather[0].description,
      local: allData.name
    }
    return weatherData;
  }
  catch(error) {
    console.log('error', error);
  }
}

const postData = async function (url = '', data = {}) {
  const response = await fetch(server+url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  try {
    const stringResponse = await response.text();
    console.log(stringResponse);
    return stringResponse;
  }catch(error) {
    console.log("error", error);
  }
};

const retrieveProjectData = async () =>{
  const request = await fetch(server+'/all');
  try {
    // Transform into JSON
    const projectData = await request.json();
    return projectData;
  }
  catch(error) {
    console.log('error', error);
  }
};

const updateUI = async (projectData) => {
  const { temperature, description, local, feeling, date} = projectData[0];

  uiDate.innerHTML = date;
  uiTemp.innerHTML = temperature;
  uiContent.innerHTML = `
    <div>${local}</div>
    <div>${description}</div>
    <div>${feeling}</div>
  `;
}

// Event listener starting the performAction() when button is clicked
document.getElementById('generate').addEventListener('click', performAction);