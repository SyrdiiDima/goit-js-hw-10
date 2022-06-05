import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import fetchCountries from './fetchCountries.js';

const refs = {
  searchInputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const { searchInputEl, countryList, countryInfo } = refs;
const DEBOUNCE_DELAY = 300;

searchInputEl.addEventListener('input', debounce(searchField, DEBOUNCE_DELAY));

function searchField(evt) {
  const searchWord = evt.target.value.trim();
  if (searchWord === '') {
    clearCountryList();
    clearCountryInfo();
  } else {
    fetchCountries(searchWord)
      .then(data => {
        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name'
          );
          clearCountryList();
          clearCountryInfo();
        } else if (data.length >= 2 && data.length <= 10) {
          clearCountryInfo();
          countryList.innerHTML = countryListMarkup(data);
        } else {
          clearCountryList();
          countryInfo.innerHTML = countryInfoMarkup(data);
        }
      })
      .catch(error => {
        console.log(error);
        Notify.failure('Oops, there is no country with that name');
      });
  }
}

function countryListMarkup(countryArray) {
  return countryArray
    .map(({ name, flags }) => {
      return `<li class="country-list__item"><img src="${flags.svg}" alt="${name.official}" class="country-list_img"><span class="country-list__name">${name.official}</span></li>`;
    })
    .join('');
}

function countryInfoMarkup(countryArray) {
  return countryArray
    .map(({ name, flags, capital, population, languages }) => {
      return `<div class="country-info__name"><img src="${flags.svg}" alt="${
        name.official
      }" class="country-info__img" />${name.official}</div>
        <p><span class="country-info__boldtext">Capital: </span>${capital}</p>
        <p><span class="country-info__boldtext">Population: </span>${population}</p>
        <p><span class="country-info__boldtext">Languages: </span>${Object.values(
          languages
        ).join(', ')}</p>`;
    })
    .join('');
}
function clearCountryList() {
  countryList.innerHTML = '';
}
function clearCountryInfo() {
  countryInfo.innerHTML = '';
}
