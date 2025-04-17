const apiKeys = {
    GNews : 'f83f3ede3b6ee1437808418ef24b56f9',
    NewsApi : '835296e4109c467daf3a7e1ea689d008',
    MediaStack : '4c9226abb55dd64bb44f101e84c0ec19',
}

const apiUrls = {
    GNews: (category, apiKey) => `https://gnews.io/api/v4/search?q=${category}&lang=fr&token=${apiKey}`,
    NewsApi: (category, apiKey) => `https://newsapi.org/v2/everything?q=${category}&sortBy=popularity&apiKey=${apiKey}`,
    MediaStack: (category, apiKey) => `http://api.mediastack.com/v1/news?q=${category}&sortBy=popularity&apiKey=${apiKey}`
  };

function fetchNews(api, category) {
  const url = apiUrls[api](category, apiKeys[api]);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data); // Vérifie la structure des données dans la console
      const newsContainer = document.getElementById('news-container');
      newsContainer.innerHTML = ''; // Nettoie les anciens articles

      if (!data.data || data.data.length === 0) {
        newsContainer.innerHTML = '<p>Aucun article trouvé.</p>';
        return;
      }

      data.data.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.innerHTML = `
          <h2>${article.title}</h2>
          <img src="${article.urlToImage || 'https://via.placeholder.com/300'}" alt="Image de l'article" width="300">
          <p>${article.description || 'Pas de description disponible.'}</p>
          <a href="${article.url}" target="_blank">Lire l'article</a>
          <hr>
        `;
        newsContainer.appendChild(articleElement);
      });
    })
    .catch(error => console.error('Erreur:', error));
}
