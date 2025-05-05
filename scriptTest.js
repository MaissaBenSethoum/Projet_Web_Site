const apiKeys = {
  GNews : 'f83f3ede3b6ee1437808418ef24b56f9',
  NewsApi : '835296e4109c467daf3a7e1ea689d008',
  MediaStack : '4c9226abb55dd64bb44f101e84c0ec19',
};

const apiUrls = {
  GNews: (category, apiKey) => `https://gnews.io/api/v4/search?q=${category}&lang=fr&max=3&token=${apiKey}`,
  NewsApi: (category, apiKey) => `https://newsapi.org/v2/top-headlines?q=${category}&language=fr&pageSize=1&apiKey=${apiKey}`,
  MediaStack: (category, apiKey) => `http://api.mediastack.com/v1/news?access_key=${apiKey}&keywords=${category}&languages=fr&sortBy=popularity&limit=3`
};

function fetchNews(api, category) {
  const url = apiUrls[api](category, apiKeys[api]);

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      let articles = [];
      if ((api === 'GNews') || (api === 'NewsApi')) {
        articles = data.articles || [];  
      } else if (api === 'MediaStack') {
        articles = data.data || []; 
      }
      console.log(data);
      return articles.map(article => ({ ...article, theme: category }));
    })
    .catch(error => {
      console.error(`Erreur avec ${api} pour ${category} :`, error);
      return [];
    });
}

function getThemes() {
  let url = window.location.href;
  let params = url.split('?')[1];
  let results = params.split('=')[1];
  results = decodeURIComponent(results);
  results = JSON.parse(results);
  results.sort();
  return results;
}

function renderThemes(themeList, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  themeList.forEach(theme => {
    const p = document.createElement("p");
    p.textContent = theme;
    container.appendChild(p);
  });
}

function genererArticles(articles) {
  const container = document.getElementById("actu-box");
  container.innerHTML = ""; 

  articles.forEach(article => {
    const div = document.createElement("div");
    div.className = "boite-actu";
    div.onclick = () => location.href = article.lien || '#';

    const theme = article.theme || 'default';
    const themeClean = theme.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "_");
    const fallbackImage = `img/${themeClean}.png`;

    div.innerHTML = `
       <div class="titre-actu">${article.titre || article.title}</div>
       <div class="contenu-actu">
         <img src="${article.image || article.urlToImage}" 
               onerror="this.onerror=null;this.src='${fallbackImage}'" 
               alt="Image Actu">
         <div class="texte-actu">
            <p>${article.contenu || article.description || 'Pas de description disponible.'}</p>
            <a href="${article.url}" target="_blank">Lire l'article</a>  <!-- Lien vers l'article -->
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

const default_articles = [
  {
    titre: "Municipales 2026 : la Métropole du Grand Paris, enjeu de l’élection dans la capitale",
    image: "img/image_test_1.avif",
    contenu: "Plusieurs candidats de gauche font de ce sujet un axe de leur campagne.",
    lien: "details.html"
  },
  {
    titre: "Déserts médicaux : « S’il faut réussir un entretien d’embauche pour avoir un médecin, c’est grave »",
    image: "img/image_test_2.avif",
    contenu: "Des patients témoignent de leurs « parcours du combattant » pour trouver un rendez-vous.",
    lien: "details.html"
  }
];

function fetchArticlesForThemes(selectedThemes) {
  let fetchPromises = [];

  selectedThemes.forEach(theme => {
    ['GNews', 'NewsApi', 'MediaStack'].forEach(api => {
      fetchPromises.push(fetchNews(api, theme));
    });
  });

  Promise.all(fetchPromises).then(results => {
    const seenTitles = new Set();
    const allArticles = results.flat().filter(article => {
      const title = (article.title || article.titre || '').trim().toLowerCase();

      if (!title || seenTitles.has(title)) return false;
      seenTitles.add(title);
      return true;
    });

    genererArticles(allArticles);
  });
}

function themeNonChoisieAleatoire(selectedThemes) {
  const allThemes = Object.values(themeMap);
  const unselected = allThemes.filter(theme => !selectedThemes.includes(theme));
  if (unselected.length === 0){
    return Object.values(themeMap)[Math.floor(Math.random() * Object.values(themeMap).length)];
  };
  return unselected[Math.floor(Math.random() * unselected.length)];
}

function updateSidebarWithTheme(theme_name, article) {
  const sidebar = document.querySelector(".droite");
  sidebar.innerHTML = ""; // Nettoie la sidebar

  // Titre de section
  const titreSection = document.createElement("div");
  titreSection.className = "section-titre";
  titreSection.innerText = `Ce qui peut vous intéresser en ${theme_name}`;
  sidebar.appendChild(titreSection);

  // Contenu de l'article
  const apercuActu = document.createElement("div");
  apercuActu.className = "aperçu-actu";

  apercuActu.innerHTML = `
    <div class="titre-actu">${article.titre || article.title}</div>
    <div class="contenu-actu">
      <img src="${article.image || article.urlToImage || 'https://via.placeholder.com/250x170'}" alt="Image">
      <div class="texte-actu">
        <p>${article.contenu || article.description || "Aucune description disponible."}</p>
        <a href="${article.url}" target="_blank">Lire l'article</a>
      </div>
    </div>
  `;

  sidebar.appendChild(apercuActu);
}

window.onload = function () {
  const selectedThemes = getThemes();
  renderThemes(selectedThemes, "selected-themes");
  fetchArticlesForThemes(selectedThemes);
};

