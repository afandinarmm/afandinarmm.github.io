const main = document.querySelector(".main"),
inputPart = document.querySelector(".input_sec"),
infoTxt = inputPart.querySelector(".info"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = main.querySelector(".weather_sec"),
wIcon = weatherPart.querySelector("img"),
arrowBack = main.querySelector("header i");
let api;
inputField.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});
locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});
function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=a13804820be60ac147f012b7857cf0da`;
    fetchData();
}
function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=a13804820be60ac147f012b7857cf0da`;
    fetchData();
}
function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}
function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}
function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, temp_min, temp_max, humidity, pressure} = info.main;
        const{speed, deg} = info.wind;

        console.log(info);

        let windDirection;

        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }

        if(deg < 90) {
            windDirection = "North";
        } else if(deg < 180) {
            windDirection = "East";
        } else if(deg < 270) {
            windDirection = "South";
        } else {
            windDirection = "West";
        };
        
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".temp .numb-3").innerText = Math.floor(temp_max);
        weatherPart.querySelector(".temp .numb-4").innerText = Math.floor(temp_min);
        weatherPart.querySelector("#humidty").innerText = `${humidity}%`;
        weatherPart.querySelector("#pressure").innerText = `${pressure}hg`;
        weatherPart.querySelector("#speed").innerText = `${speed}km/h`;
        weatherPart.querySelector("#direction").innerText = `${windDirection} - ${deg}°`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        main.classList.add("active");
    }
}
arrowBack.addEventListener("click", ()=>{
    main.classList.remove("active");
});



