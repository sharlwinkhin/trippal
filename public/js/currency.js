const amount = document.getElementById('amount');
const currencyFrom = document.getElementById('currencyFrom');
const currencyTo = document.getElementById('currencyTo');
const result = document.getElementById('result');


window.addEventListener('load', async (e) => {
   console.log('loading...');
   populateDropdown();
})


async function populateDropdown() {
   try {
      const url = 'https://api.frankfurter.dev/v1/currencies';
      const response = await axios.get(url);
      console.log(response.data);

      for (let code in response.data) {
         let name = response.data[code];

         let optionFrom = currencyFrom.appendChild(document.createElement('option'));
         optionFrom.value = code;
         optionFrom.textContent = name;

         let optionTo = currencyTo.appendChild(document.createElement('option'));
         optionTo.value = code;
         optionTo.textContent = name;
      }

      currencyFrom.addEventListener('change', doConversion);
      currencyTo.addEventListener('change', doConversion);
      amount.addEventListener('change', doConversion);

   } catch (error) {
      console.error(error);
   }


}

async function doConversion() {

   let from = currencyFrom.value;
   let to = currencyTo.value;

   if (from.length <= 0 || to.length <= 0) {
      while (result.firstChild) result.firstChild.remove();
      return;
   }

   try {
      const url = `https://api.frankfurter.dev/v1/latest?`;
      const response = await axios.get(url, {
         params: {
            base: from,
            symbols: to
         }
      });
      console.log(response.data);

      let converted = response.data.rates[to] * Number(amount.value);
      result.innerText = `${amount.value} ${from} = ${converted.toFixed(2)} ${to}`;

   } catch (error) {
      console.error(error);
   }
}