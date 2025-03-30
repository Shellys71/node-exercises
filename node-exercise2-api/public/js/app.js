const dictionaryForm = document.querySelector('form');
const search = document.querySelector('input');
const selectedWord = document.querySelector('#message-1');
const translatedWord = document.querySelector('#message-2');
const rndBtn = document.querySelector('#rnd-btn');

dictionaryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const word = search.value;

    selectedWord.textContent = 'Loading...';
    translatedWord.textContent = '';

    fetch('http://localhost:4000/dictionary?word=' + word).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                selectedWord.textContent = data.error;
            } else {
                if (word !== '') {
                    selectedWord.textContent = data.word;
                    translatedWord.textContent = data.defenition;  
                    translatedWord.innerHTML += '<br/><button id="translate-btn">I want to translate all the page</button>';
                    document.querySelector('#translate-btn').addEventListener('click', translateAll);
                } else {
                    selectedWord.textContent = 'Insert a word please!';
                }
            }
        });
    })
});

rndBtn.addEventListener('click', () => {
    fetch('https://random-word-api.vercel.app/api').then((response) => {
        response.json().then((rndWord) => {
            if (rndWord.error) {
                selectedWord.textContent = rndWord.error;
            } else {
                search.value = rndWord;
            }
        });
    })
});

const translateAll = () => { 
    const textToTranslate = document.querySelectorAll('.to-translate');
    textToTranslate.forEach(text => {
        fetch('https://api.funtranslations.com/translate/minion.json?text=' + text.innerText).then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    selectedWord.textContent = data.error;
                } else {
                    text.innerText = data.contents.translated;
                }
            });
        })
    });
}
