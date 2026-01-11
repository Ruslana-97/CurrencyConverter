// Input
const inputCurrency = document.getElementById('input');
const selectInput = document.getElementById('selectInput');
// text info
const currentData = document.querySelector('.currentData');
const textCours = document.querySelector('.course');
const typeOfCurrency = document.querySelector('.typeOfCurrency_1');
const typeOfCurrency_2 = document.querySelector('.typeOfCurrency_2');
const typeOfCurrency11 = document.querySelector('.typeOfCurrency_11');
const typeOfCurrency22 = document.querySelector('.typeOfCurrency_22');
// Output
const inputOutput = document.querySelector('.input');
const selectOutput = document.getElementById('selectOutput');
// btn
const btn = document.querySelector('.btnConvert');
// change blocks
const exchange = document.querySelector('.exchange');

// let hasChange = false;
let res = 0;
const texts = [typeOfCurrency, typeOfCurrency_2, typeOfCurrency11, typeOfCurrency22];


// Data
const date = new Date().toLocaleDateString('uk-UA', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});
currentData.textContent = date;



// // API request NBU Ukraine
async function getCourses() {
     const responce = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
     const data = await responce.json();
    // console.log(data);
     return res = {
          euro: data[38].rate,
          dollar: data[32].rate,
          idr:data[10].rate,
          markEuro: data[38].cc,
          markDollar: data[32].cc,
          markIdr:data[10].cc,
     };
     
}

async function countCourses() {
  const rates = await getCourses();

  const from = selectInput.value;
  const to = selectOutput.value;

  // const amount = +inputCurrency.value || 0 ;
   const amount = parseFloat(inputCurrency.value.replace(/\s/g, '')) || 0;
  if (from === to) {
    showError(true);
    inputOutput.value = 0;
    
    return;
  }

  showError(false);

  const ratesUAH = {
    UAH: 1,
    USD: rates.dollar,
    EUR: rates.euro,
    IDR: rates.idr
  };

  const rate = ratesUAH[from] / ratesUAH[to];

  setTexts(from, to, rate);
  // inputOutput.value = (amount * rate).toFixed(2);
    inputOutput.value = (amount * rate).toLocaleString('uk-UA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

//Show text 
function setTexts(from, to, rate) {
  const [t1, t2, t3, t4] = texts;

    t1.textContent = `1 ${from} = `;
    t2.textContent = ` ${rate.toFixed(4)} ${to}`;
    t3.textContent = `1 ${to} = `;
  t4.textContent = ` ${(1 / rate).toFixed(4)} ${from}`;
  
  const temp1 = t1.textContent;
  const temp2 = t2.textContent;
 
     // міняємо місцями
  t1.textContent = t3.textContent;
  t2.textContent = t4.textContent;
  t3.textContent = temp1;
  t4.textContent = temp2;


}


//Error
function showError(show) {
     let error = document.querySelector('.errorText');

     if (!error) {
     error = document.createElement('p');
     error.className = 'errorText';
     error.textContent = 'Data missing';
     textCours.appendChild(error);
     }

     error.style.display = show ? 'block' : 'none';

     [typeOfCurrency, typeOfCurrency_2, typeOfCurrency11, typeOfCurrency22]
     .forEach(el => el.style.display = show ? 'none' : 'inline-block');
}



[inputCurrency, selectInput, selectOutput].forEach(el =>
  el.addEventListener('input', countCourses)
);
btn.addEventListener('click', countCourses);


async function init() {
     await getCourses(); 
     countCourses(); 
}

init();


exchange.addEventListener('click', changeBlocks);


function changeBlocks() {
    // --- SWAP input і select ---
    const amountInput = inputCurrency.value;
    const amountOutput = inputOutput.value;

    if (amountInput === 0 && amountOutput === 0) return;

    inputCurrency.value = amountOutput ? amountOutput.toString() : '0';
    inputOutput.value = amountInput ? amountInput.toString() : '0';

    const tempSelect = selectInput.value;
    selectInput.value = selectOutput.value;
    selectOutput.value = tempSelect;

    countCourses();
}



function digitsInt(target) {
    let val = target.value;
    val = val.replace(/[^0-9]/g, '');
    val = val.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    target.value = val;
}


document.addEventListener('DOMContentLoaded', () => {
  digitsInt(inputCurrency);
  digitsInt(inputOutput);
  
    inputOutput.addEventListener('input', () => {
        digitsInt(inputOutput);
    });
    inputCurrency.addEventListener('input', () => {
        digitsInt(inputCurrency);
    });
});




