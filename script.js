// * There should be a header showing icon and two tabs "HOME" and "LIKED LIST"
// * The TAB should show an active style for current active tab
// * There should be a dropdown select with categories "Popular", "Now playing", "Top rated" and "Up coming"
// * The app should load the "Popular" movies by default.
// * Each page should have 20 movie card, 4 card in a row
// * Each movie card should show the movie poster, movie title, movie rating with a star icon and outlined like icon
// * Clicking the "like" icon will turn the icon from outlined to solid contained red.
// * Hovering on the movie title will turn title to another color
// * Clicking the movie title in the card will open a movie detail modal
// * The movie detail modal has a semi black transparent backdrop effect
// * The movie detail modal should show movie poster, movie title, movie overview, movie genres, movie rating and movie production companies logos
// * There should a close icon on the top right allowing the user to close the modal.
// * There should be a pagination section with a "prev", a "next" button and a text of current page and total page
// * Clicking on the next button will load next page of movies for current category
// * Clicking on the prev button will load prev page of movies for current category
// * The perv button should be disabled when it is the first page
// * The next button should be disabled when it is the last page
// * Choosing other category from the drop down should load the first page of movies for the selected category
// * Clicking on the "LIKED LIST" in the header should list all liked movies
// * Clicking the like button of the already like movie again should remove it from the like list

// Resources:
// Movie details: https://developers.themoviedb.org/3/movies/get-movie-details
// Now playing movies: https://developers.themoviedb.org/3/movies/get-now-playing
// Popular movies: https://developers.themoviedb.org/3/movies/get-popular-movies
// Top rated movies: https://developers.themoviedb.org/3/movies/get-top-rated-movies
// Up coming movies: https://developers.themoviedb.org/3/movies/get-upcoming
// logo & colors: https://www.themoviedb.org/about/logos-attribution
// rating icon color: #f5c518
// icons: https://ionicons.com/v4/

console.log(document.querySelector("iframe"));

const API_KEY = "9b30f4f4b4ec67ccead2c52ac501af6c";

const BASE_URL = "https://api.themoviedb.org/3";
const IMG_SRC_BASE = `https://image.tmdb.org/t/p/w500`;

const TABS = {
  HOME: "HOME",
  LIKE: "LiKED"
};

const model = {
  movieList: [],
  likedList: [],
  activeTab: TABS.HOME,
  totalPages: 0,
  currentMovie: null,
  currentFilter: "popular",
  currentPage: 1
};

const loadMovieData = (category, page) => {
  return fetch(
    `${BASE_URL}/movie/${category}?page=${page}&api_key=${API_KEY}`
  ).then((resp) => {
    if (resp.ok) {
      return resp.json();
    } else {
      return [];
    }
  });
};

const loadMovies = (category, page) => {
  return loadMovieData(category, page).then((movieData) => {
    model.movieList = movieData.results;
    model.totalPages = movieData.total_pages;
  });
};

const fetchMovieData = (movieId) => {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
  return fetch(url).then((resp) => {
    return resp.json();
  });
};

const createMovieCard = (movie) => {
  const cardDiv = document.createElement("div");
  cardDiv.className = "movie-card";
  cardDiv.id = movie.id;
  const liked = model.likedList.some(
    (likedMovie) => likedMovie.id === movie.id
  );
  const imgSrc = `${IMG_SRC_BASE}${movie.poster_path}`;
  const cardHTML = `
    <div class="movie-card-img">
      <img src="${imgSrc}">
    </div>
    <h4 class="movie-card-title">${movie.title}</h4>
    <div class="movie-card-rating">
      <div class='rating'>
        <i class="icon ion-md-star rating-icon"></i>
        <span>${movie.vote_average}</span>
      </div>
      <div>
        <i class="like-icon icon ${
          liked ? "ion-md-heart" : "ion-md-heart-empty"
        }"></i>
      </div>
    </div>
  `;

  cardDiv.innerHTML = cardHTML;
  return cardDiv;
};

const showModal = () => {
  const modal = document.querySelector("#modal");
  modal.style.display = "flex";
};

const closeModal = () => {
  const modal = document.querySelector("#modal");
  modal.style.display = "none";
};

const updateTabs = () => {
  const currentTab = model.activeTab;
  const tabItems = document.querySelectorAll(".tab-item");
  tabItems.forEach((tab) => {
    const tabName = tab.getAttribute("name");
    if (tabName === currentTab) {
      tab.className = "tab-item active";
    } else {
      tab.className = "tab-item";
    }
  });
  const homeContainer = document.querySelector("#homeContainer");
  const likedContainer = document.querySelector("#likedContainer");
  if (currentTab === TABS.HOME) {
    homeContainer.className = "tab-view tab-view-active";
    likedContainer.className = "tab-view";
  } else {
    likedContainer.className = "tab-view tab-view-active";
    homeContainer.className = "tab-view";
  }
};

const updateLists = () => {
  const movieList = model.movieList;

  const movieListContainer = document.querySelector("#movieList");

  movieListContainer.innerHTML = "";

  movieList.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    movieListContainer.append(movieCard);
  });

  const likedList = model.likedList;

  const likedListContainer = document.querySelector("#likedList");
  likedListContainer.innerHTML = "";

  likedList.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    likedListContainer.append(movieCard);
  });
};

const updatePagination = () => {
  const currentPage = model.currentPage;
  const totalPages = model.totalPages;

  const currentPageContainer = document.querySelector("#currentPage");
  currentPageContainer.innerHTML = `${currentPage} / ${totalPages}`;
};

const updateModal = () => {
  const movieData = model.currentMovie;

  const modelContentHTML = `
    <div class="modal-img">
        <img src="${IMG_SRC_BASE}/${movieData.poster_path}" />
    </div>
    <div class="modal-info">
        <h2>${movieData.title}</h2>
        <br />
        <h3>Overview</h3>
        <p class="modal-overview">
        ${movieData.overview}
        </p>
        <h3>Genres</h3>
        <div class="genre-container">
            ${movieData.genres.map((genre) => {
              return `<div class="genre-item">${genre.name}</div>`;
            })}
        </div>
        <h3>Rating</h3>
        <p>${movieData.vote_average}</p>
        <h3>Production companies</h3>
        <div class="production-container">
       
            ${movieData.production_companies.map((company) => {
              return `
              <div class="production-item">
                <img src="${IMG_SRC_BASE}/${company.logo_path}" />
                </div>`;
            })}
        
        </div>
    </div>
    `;
  const modelContentContainer = document.querySelector(".modal-content");
  modelContentContainer.innerHTML = modelContentHTML;
};

const handleNavBarClick = (e) => {
  const target = e.target;
  const name = target.getAttribute("name");
  if (!name) {
    return;
  }

  model.activeTab = name;
  updateTabs();
};

const handleListClick = (e) => {
  const target = e.target;
  const card = target.closest(".movie-card");
  if (!card) {
    return;
  }

  const movieId = Number(card.id);
  if (target.classList.contains("like-icon")) {
    const movieData = model.movieList.find((movie) => movie.id === movieId);
    const alreadyLiked = model.likedList.some(
      (likedMovie) => likedMovie.id === movieId
    );
    if (alreadyLiked) {
      model.likedList = model.likedList.filter((movie) => movie.id !== movieId);
    } else {
      model.likedList.push(movieData);
    }
    updateLists();
    return;
  }

  if (target.classList.contains("movie-card-title")) {
    fetchMovieData(movieId).then((movieData) => {
      model.currentMovie = movieData;
      updateModal();
      showModal();
    });
  }
};

const handleFilterChange = (e) => {
  const value = e.target.value;
  model.currentFilter = value;
  loadMovies(model.currentFilter, 1).then(() => {
    updateLists();
    updatePagination();
  });
};

const handleClickNext = () => {
  const currentPage = model.currentPage;
  if (currentPage === model.totalPages) {
    return;
  }
  const nextPage = currentPage + 1;
  loadMovies(model.currentFilter, nextPage).then(() => {
    model.currentPage = nextPage;
    updateLists();
    updatePagination();
  });
};

const handleClickPrev = () => {
  const currentPage = model.currentPage;
  if (currentPage === 1) {
    return;
  }
  const nextPage = currentPage - 1;
  loadMovies(model.currentFilter, nextPage).then(() => {
    model.currentPage = nextPage;
    updateLists();
    updatePagination();
  });
};

const loadEvent = () => {
  const navBar = document.querySelector(".nav-bar");
  const lists = document.querySelectorAll(".list-container");
  const closeModalElement = document.querySelector(".close-modal");
  const select = document.querySelector(".filter-select");
  const nextButton = document.querySelector("#nextButton");
  const prevButton = document.querySelector("#prevButton");

  nextButton.addEventListener("click", handleClickNext);
  prevButton.addEventListener("click", handleClickPrev);

  select.addEventListener("change", handleFilterChange);

  closeModalElement.addEventListener("click", closeModal);
  lists.forEach((list) => {
    list.addEventListener("click", handleListClick);
  });

  navBar.addEventListener("click", handleNavBarClick);
};

const onLoad = () => {
  loadEvent();
  loadMovies(model.currentFilter, 1).then(() => {
    updateTabs();
    updateLists();
    updatePagination();
  });
};

onLoad();
