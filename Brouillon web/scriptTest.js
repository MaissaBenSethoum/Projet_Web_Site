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

function getThemes(){
    let url = window.location.href;
    let params = url.split('?')[1];
    let results = params.split('=')[1];
    results = decodeURIComponent(results);
    results = JSON.parse(results);
    results.sort()
    return results;
}

function renderThemes(themeList, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Vide le conteneur actuel

  themeList.forEach(theme => {
      const p = document.createElement("p");
      p.textContent = theme;
      container.appendChild(p);
  });
}

const default_articles = [
  {
    titre: "Municipales 2026 : la Métropole du Grand Paris, enjeu de l’élection dans la capitale",
    image: "img/image_test_1.avif",
    contenu: "Plusieurs candidats de gauche font de ce sujet un axe de leur campagne. Mais une réelle réforme de cette entité ne pourra se faire qu’à condition de s’attaquer au millefeuille qui la caractérise.",
    lien: "details.html"
  },
  {
    titre: "Déserts médicaux : « S’il faut réussir un entretien d’embauche pour avoir un médecin, c’est grave »",
    image: "img/image_test_2.avif",
    contenu: "Alors qu’une proposition de loi examinée à l’Assemblée nationale début avril fait polémique, des patients témoignent de leurs « parcours du combattant » pour trouver un rendez-vous.",
    lien: "details.html"
  },
];

function genererArticles(articles) {
  const container = document.getElementById("actu-box");
  
  articles.forEach(article => {
    const div = document.createElement("div");
    div.className = "boite-actu";
    div.onclick = () => location.href = article.lien;

    div.innerHTML = `
      <div class="titre-actu">${article.titre}</div>
      <div class="contenu-actu">
        <img src="${article.image}" alt="Image Actu">
        <div class="texte-actu">
          <p>${article.contenu}</p>
        </div>
      </div>
    `;

    container.appendChild(div);
  });
}

window.onload = function () {
  renderThemes(getThemes(), "selected-themes");
  genererArticles(default_articles);
};