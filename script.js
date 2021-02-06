'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Janusz sowa',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2021-01-30T21:36:17.929Z',
    '2021-02-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jagoda Drwal',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Paweł Kowal',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2021-02-01T10:51:36.790Z',
  ],
  currency: 'PLN',
  locale: 'pl-PL',
};

const account4 = {
  owner: 'Alex Nowak',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'BTC',
  locale: 'sk-SK',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const labelTotalMovements = document.querySelector('.total__movements');

const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) => 
  Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`;
  
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();

  //  return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);

};

const formatCur = (value, locale, currency) => {
  
    return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);

}

const displayMovements = function(acc, sort = false) {

  containerMovements.innerHTML = ''; 
  
  const movs =  sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  
  movs.forEach((mov, i) => {

    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html)
  });
}

const totalAccountMovements = acc => {
  labelTotalMovements.textContent = `Total movements: ${acc.movements.length}`
  
}

const calcDisplayBalance = acc => {
  
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);;
}

const calcDisplaySummary = (acc) => {

  
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

    labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);;

};

const createUsersNames = accs => {

accs.forEach(acc => {

  acc.userName = acc.owner
  .toLocaleLowerCase()
  .split(' ')
  .map( name => name[0] )
  .join('');

  })
};

createUsersNames(accounts);

const updateUI = (acc) => {

  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
  totalAccountMovements(acc);
  
}

//Events

let currentAccount;

//Fake
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;



btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  
  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
  
  inputTransferAmount.value = inputTransferTo.value = '';

  if(currentAccount?.pin === +inputLoginPin.value) {
    
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    // weekday: 'long',
  }
  labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);

  } else {
    containerApp.style.opacity = 0;
  }


});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const reciverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);

  if(amount > 0 && 
    reciverAcc &&
    currentAccount.balance >= amount &&
    reciverAcc?.userName !== currentAccount.userName) {
    
      currentAccount.movements.push(-amount);
      reciverAcc.movements.push(amount);

      //add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      reciverAcc.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
  }

});


btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if(amount > 0  && currentAccount.movements.some(mov =>  mov >+ amount * 0.1)) {
    
    currentAccount.movements.push(amount);

    //add loan date
    currentAccount.movementsDates.push(new Date().toISOString());
    
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';

});


btnClose.addEventListener('click', (e) => {
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin) {
        
      const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);

      accounts.splice(index, 1);

      containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';

});

let sorted = false;

btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);

  sorted = !sorted;
});