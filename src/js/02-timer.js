// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  dateInput: document.querySelector('input#datetime-picker'),
  startButton: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

const TIME_STEP = 1000;

let timeLeftMs = 0;
let selectedUnixDateTime = 0;
let timerId = null;

refs.startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const currentDate = new Date();

    if (currentDate > selectedDates[0]) {
      refs.startButton.disabled = true;
      Notify.failure('Please choose a date in the future');
      return;
    }

    refs.startButton.disabled = false;

    selectedUnixDateTime = selectedDates[0].getTime();
  },
};

flatpickr(refs.dateInput, options);

refs.startButton.addEventListener('click', onStartButtonClickHandler);

function onStartButtonClickHandler(event) {
  event.currentTarget.disabled = true;
  const currentDate = new Date();
  timeLeftMs = selectedUnixDateTime - currentDate.getTime();
  displayTime();
  timerId = setInterval(displayTime, TIME_STEP);
}

function displayTime() {
  const timeLeft = convertMs(timeLeftMs);
  refs.days.innerHTML = addLeadingZero(timeLeft.days);
  refs.hours.innerHTML = addLeadingZero(timeLeft.hours);
  refs.minutes.innerHTML = addLeadingZero(timeLeft.minutes);
  refs.seconds.innerHTML = addLeadingZero(timeLeft.seconds);

  timeLeftMs -= TIME_STEP;
  if (timeLeftMs <= 0) {
    clearInterval(timerId);
  }
}

function addLeadingZero(value) {
    return value.toString().padStart(2, "0");
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
