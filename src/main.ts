import './style.css'
import { setupCounter } from './counter.ts'

// TODO --- Migrate to calc function file

const time = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  pace: 0,
  paceKilo: 0,
}


const kiloPerMile = 0.621371;

const result = {
    mile: document.getElementById('res-miles') as HTMLSpanElement,
    kilo: document.getElementById('res-kilo') as HTMLSpanElement,
}

const input = {
    distance: document.getElementById('dis-input') as HTMLInputElement,
    hours: document.getElementById('hour-input') as HTMLInputElement,
    minutes: document.getElementById('min-input') as HTMLInputElement,
    seconds: document.getElementById('sec-input') as HTMLInputElement,
}



const calcPace = () => {
    time.hours = parseInt(input.hours.value || '0');
    time.minutes = parseInt(input.minutes.value || '0');
    time.seconds = parseInt(input.seconds.value || '0');
    const distance = parseInt(input.distance.value || '0');

    if (distance === 0 || (time.hours === 0 && time.minutes === 0 && time.seconds === 0)){
      return;
    } else {
      time.pace = ((time.hours * 60 + time.minutes * 1 + time.seconds / 60) / distance);
      time.paceKilo = time.pace * kiloPerMile;
    }

    const pace : {minutes: number, seconds: number} =  {
      minutes: Math.floor(time.pace),
      seconds: Math.floor((time.pace - Math.floor(time.pace)) * 60)
    }
    const paceKilo : {minutes: number, seconds: number} =  {
      minutes: Math.floor(time.paceKilo),
      seconds: Math.floor((time.paceKilo - Math.floor(time.paceKilo)) * 60)
    }

    console.log('pace', pace);
    console.log('paceKilo', paceKilo);


    result.mile.innerHTML = pace.minutes + ':' + (pace.seconds <= 9 ? '0' : '') + pace.seconds ;
    result.kilo.innerHTML = paceKilo.minutes + ':' + pace.minutes;

}




const inputEvent = (e: Event) => {
  const target = e.target as HTMLInputElement;

  const idKey = target.id.slice(0, target.id.indexOf('-'))
  const display = document.getElementById(idKey + '-display');

  const lengthLimit = idKey === 'dis' ? 6 : 2;

  if (target.value.length > lengthLimit) {
    target.value = target.value.slice(0, lengthLimit);
    return;
  }

  if (display) {
    display.innerHTML = target.value  || '0';
  }


  if (display) {
    if (idKey === 'dis' || idKey === 'hour') // Distance
      display.innerHTML = target.value  || '0';
    else if (target.value.length === 1)
      display.innerHTML = 0 + target.value ;
    else
      display.innerHTML = target.value || '00';
  }

  calcPace();

}

calcPace();

input.hours.addEventListener('input',  inputEvent);
input.minutes.addEventListener('input',  inputEvent);
input.seconds.addEventListener('input',  inputEvent);
input.distance.addEventListener('input',  inputEvent);
