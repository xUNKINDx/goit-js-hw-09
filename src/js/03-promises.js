const form = document.querySelector('.form');

form.addEventListener('submit', onFormSubmitHandler);

function onFormSubmitHandler(event) {
  event.preventDefault();
  const {
    elements: { delay, step, amount },
  } = event.currentTarget;

  createPromises(
    parseInt(delay.value),
    parseInt(step.value),
    parseInt(amount.value)
  );
}

function createPromises(currentDelay, step, amount) {
  for (let currentPosition = 1; currentPosition <= amount; currentPosition++) {
    createPromise(currentPosition, currentDelay)
      .then(({ position, delay }) => {
        console.log(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        console.log(`❌ Rejected promise ${position} in ${delay}ms`);
      });
    currentDelay += step;
  }
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  if (shouldResolve) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ position, delay });
      }, delay);
    });
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject({ position, delay });
      }, delay);
    });
  }
}
