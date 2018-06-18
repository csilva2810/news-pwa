// get your news API KEY here: https://newsapi.org/
const apiKey = '';
const apiBaseURL = 'https://newsapi.org/v1';

const main = document.querySelector('main');
const sourcesSelector = document.querySelector('#sourcesSelector');
const defaultSource = 'the-verge';

window.addEventListener('load', async e => {
    updateNews();
    await fetchSources();

    sourcesSelector.value = defaultSource;
    sourcesSelector.addEventListener('change', e => {
        updateNews(e.target.value);
    });

    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('sw.js');
        } catch (error) {
            console.error(error);
        }
    }
});


async function updateNews(source = defaultSource) {
    const res = await fetch(`${apiBaseURL}/articles?source=${source}&apiKey=${apiKey}`);
    const json = await res.json();

    main.innerHTML = json.articles.map(createArticle).join('\n');
}

async function fetchSources() {
    const res = await fetch(`${apiBaseURL}/sources`);
    const json = await res.json();

    sourcesSelector.innerHTML = json.sources
        .map(source => `<option value="${source.id}"}>${source.name}</option>`)
        .join('\n');
}

function createArticle(article) {
    return `
    <div class="card">
        <img class="card-img-top" src="${article.urlToImage}" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${article.title}</h5>
            <p class="card-text">${article.description}</p>
            <div class="text-right">
                <a href="${article.url}" target="_blank" class="btn btn-outline-primary">
                    See Article &#10132;
                </a>
            </div>
        </div>
    </div>
    `
}
