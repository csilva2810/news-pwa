// definindo nossos recursos estáticos
const staticAssets = [
    './',
    './app.js',
    './styles.css'
];

// evento que será disparado quando o browser tentar instalar
// esse service worker
self.addEventListener('install', async e => {
    // criamos um cache para recursos estáticos
    const cache = await caches.open('news-static');

    // adicionamos todos os recursos estáticos no cache estático
    cache.addAll(staticAssets);
});

// sempre que uma requisição for feita, esse evento será disparado
// definindo esse eventListener conseguimos interceptar as requisições que
// o browser está fazendo
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // caso o browser esteja solicitando um recurso da mesma origem
    // ou seja, recursos que estão no nosso host
    // vamos usar a estratégia cacheFirst para tentarmos pegar o recurso primeiro
    // no cache e caso não dê certo, tentamos na internet
    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(e.request));
        return;
    }

    // caso contrário, usamos a estratégia networkFirst
    // que consiste em buscarmos o recurso primeiro na internet
    // e se não conseguirmos tentamos pegar do cache
    // essa estratégia é boa para ser usada para coisas dinâmicas
    // como API`s e até mesmo libs externas, como por exemplo o bootstrap e jQuery
    e.respondWith(networkFirst(e.request));
});

// estratégia para tentar pegar o recurso primeiro no cache
async function cacheFirst(request) {
    // tentamos pegar o recurso no cache
    const cachedResponse = await caches.match(request);

    // caso dê certo, respondemos com o recurso cacheado
    // caso contrário respondemos com o recurso da internet
    return cachedResponse || fetch(request);
}

// estratégia para tentar pegar o recurso primeiro na internet
async function networkFirst(request) {
    // criamos um cache para recursos dinâmicos
    const cache = await caches.open('new-dynamic');

    try {
        // tentamos pegar o recurso na internet
        const response = await fetch(request);
        // se conseguirmos, colocamos esse recurso no cache dinâmico
        // e retornamos para o browser
        cache.put(request, response.clone());
        return res;
    } catch (error) {
        // se algo der errado ao procurar o recurso, tentamos pegar do cache
        return await cache.match(request);
    }
}
