const dictionaryForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');
const rndBtn = document.querySelector('#rnd-btn');

dictionaryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const word = search.value;

    messageOne.textContent = 'Loading...';
    messageTwo.textContent = '';

    fetch('http://localhost:4000/dictionary?word=' + word).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error;
            } else {
                if (word !== '') {
                    messageOne.textContent = data.word;
                    messageTwo.textContent = data.defenition;  
                    messageTwo.innerHTML += '<br/><button id="translate-btn">I want to translate all the page</button>';
                    document.querySelector('#translate-btn').addEventListener('click', translateAll);
                } else {
                    messageOne.textContent = 'Insert a word please!';
                }
            }
        });
    })
});

rndBtn.addEventListener('click', () => {
    fetch('https://random-word-api.vercel.app/api').then((response) => {
        response.json().then((rndWord) => {
            if (rndWord.error) {
                messageOne.textContent = rndWord.error;
            } else {
                search.value = rndWord;
            }
        });
    })
});

const translateAll = () => { 
    const textToTranslate = document.querySelectorAll('.to-trans');
    textToTranslate.forEach(text => {
        fetch('https://api.funtranslations.com/translate/minion.json?text=' + text.innerText).then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    messageOne.textContent = data.error;
                } else {
                    text.innerText = data.contents.translated;
                }
            });
        })
    });
}
