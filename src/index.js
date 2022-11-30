import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;
let nameInBox = null;
const serchUsers = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
serchUsers.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
function onInput(evt) {
  const nameInBox = evt.target.value.trim();
  if (nameInBox.length < 1) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(nameInBox)
    .then(data => {
      if (!data) {
        return;
      } else if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
      } else if (data.length > 1) {
        countryInfo.innerHTML = '';
        createMarkupList(data);
      } else if (data.length === 1) {
        countryList.innerHTML = '';
        createMarkupCard(data);
      }
    })
    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    });
}
function createMarkupList(arr) {
  const markup = arr
    .map(
      ({ name, flags }) => `<li>
    <img src="${flags.svg}" alt="${name.official}" width="60"/>
    <p class="title">${name.official}</p></li>`
    )
    .join('');
  countryList.innerHTML = markup;
}
function createMarkupCard(arr) {
  const markup = arr
    .map(({ name, flags, capital, population, languages }) => {
      return `
      <img src="${flags.svg}" alt="flag" width="60">
      <h1>${name.official}</h1>
          <li>
            <p><b>Capital</b>: ${capital}</p>
            <p><b>Population</b>: ${population}</p>
            <p><b>Language</b>: ${Object.values(languages).join(', ')}</p>
          </li>
      `;
    })
    .join('');
  countryList.innerHTML = markup;
}
