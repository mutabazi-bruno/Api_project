const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const movieList = document.getElementById("movieList");
const featuredGrid = document.getElementById("featuredGrid");
const movieDetails = document.getElementById("movieDetails");
const detailsContent = document.getElementById("detailsContent");
const searchResults = document.getElementById("searchResults");
const featuredMovies = document.getElementById("featuredMovies");
const closeBtn = document.querySelector(".close-btn");

const featuredMovieTitles = [
    "Avengers: Endgame", 
    "John Wick: Chapter 3", 
    "Inception", 
    "The Dark Knight", 
    "Parasite"
];


document.addEventListener("DOMContentLoaded", () => {
    loadFeaturedMovies();
    
    setupEventListeners();
});

function setupEventListeners() {
    searchBtn.addEventListener("click", handleSearch);
    
    searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    });
    
    searchInput.addEventListener("focus", () => {
        if (searchInput.value.trim() !== "") {
            featuredMovies.style.display = "none";
            searchResults.style.display = "block";
        }
    });
    
    closeBtn.addEventListener("click", () => {
        movieDetails.style.display = "none";
        document.body.style.overflow = "auto";
    });
    
    window.addEventListener("click", (e) => {
        if (e.target === movieDetails) {
            movieDetails.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });
    
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && movieDetails.style.display === "block") {
            movieDetails.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });
}

function handleSearch() {
    const movieName = searchInput.value.trim();
    if (movieName) {
        featuredMovies.style.display = "none";
        searchResults.style.display = "block";
        fetchMovies(movieName);
    } else {
        featuredMovies.style.display = "block";
        searchResults.style.display = "none";
        showNotification("Please enter a movie name!");
    }
}

async function loadFeaturedMovies() {
    featuredGrid.innerHTML = '<div class="loading">Loading featured movies...</div>';
    
    try {
        for (const title of featuredMovieTitles) {
            await fetchAndAddMovie(title, featuredGrid);
        }
    } catch (error) {
        featuredGrid.innerHTML = `<p>Error loading featured movies. Please try again later.</p>`;
        console.error("Error loading featured movies:", error);
    }
}

async function fetchAndAddMovie(title, container) {
    const API_KEY = config.API_KEY;
    const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`);
    const data = await response.json();
    
    if (data.Response === "True") {
        addMovieCard(data, container);
    }
}

async function fetchMovies(query) {
    movieList.innerHTML = '<div class="loading">Searching movies...</div>';
    
    try {
        const API_KEY = config.API_KEY;
        const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === "True") {
            movieList.innerHTML = "";
            
            data.Search.forEach(movie => {
                addMovieCard(movie, movieList);
            });
        } else {
            movieList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-film-slash"></i>
                    <p>No movies found. Try another search.</p>
                </div>
            `;
        }
    } catch (error) {
        movieList.innerHTML = `<p>Error searching for movies. Please try again.</p>`;
        console.error("Error searching movies:", error);
    }
}

function addMovieCard(movie, container) {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    
    const posterUrl = movie.Poster === "N/A" ? 
        "https://via.placeholder.com/300x450?text=No+Poster+Available" : movie.Poster;
    
    movieCard.innerHTML = `
        <div class="movie-poster">
            <img src="${posterUrl}" alt="${movie.Title}">
            <div class="movie-overlay">
                <div class="movie-title">${movie.Title}</div>
                <div class="movie-year">${movie.Year}</div>
            </div>
        </div>
    `;
    
    movieCard.addEventListener("click", () => fetchMovieDetails(movie.imdbID || movie.Title));
    container.appendChild(movieCard);
}


async function fetchMovieDetails(id) {
    try {
        const API_KEY = config.API_KEY;
        const queryParam = id.startsWith('tt') ? `i=${id}` : `t=${encodeURIComponent(id)}`;
        const response = await fetch(`https://www.omdbapi.com/?${queryParam}&plot=full&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === "True") {
            displayMovieDetails(data);
        } else {
            showNotification("Error loading movie details.");
        }
    } catch (error) {
        showNotification("Error loading movie details.");
        console.error("Error fetching movie details:", error);
    }
}


function displayMovieDetails(movie) {
    const posterUrl = movie.Poster === "N/A" ? 
        "https://via.placeholder.com/300x450?text=No+Poster+Available" : movie.Poster;
    
    detailsContent.innerHTML = `
        <div class="detail-content">
            <div class="detail-poster">
                <img src="${posterUrl}" alt="${movie.Title}">
            </div>
            <div class="detail-info">
                <h2 class="detail-title">${movie.Title}</h2>
                <div class="detail-meta">
                    <span>${movie.Year}</span>
                    <span>${movie.Rated || 'Not Rated'}</span>
                    <span>${movie.Runtime}</span>
                    <div class="detail-rating">
                        <i class="fas fa-star"></i>
                        <span>${movie.imdbRating}</span>
                    </div>
                </div>
                <p class="detail-plot">${movie.Plot}</p>
                <div class="detail-item"><strong>Genre:</strong> ${movie.Genre}</div>
                <div class="detail-item"><strong>Director:</strong> ${movie.Director}</div>
                <div class="detail-item"><strong>Writers:</strong> ${movie.Writer}</div>
                <div class="detail-item"><strong>Actors:</strong> ${movie.Actors}</div>
                <div class="detail-item"><strong>Awards:</strong> ${movie.Awards}</div>
            </div>
        </div>
    `;
    
   
    movieDetails.style.display = "block";
    document.body.style.overflow = "hidden"; 
}


function showNotification(message) {
   
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    

    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

const notificationCSS = document.createElement("style");
notificationCSS.textContent = `
.notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 1000;
    animation: fadeInOut 3s;
}

.loading {
    text-align: center;
    padding: 20px;
    color: var(--text-secondary);
}

.no-results {
    text-align: center;
    padding: 30px;
    color: var(--text-secondary);
}

.no-results i {
    font-size: 3rem;
    margin-bottom: 15px;
    opacity: 0.7;
}

@keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    10%, 90% { opacity: 1; }
}
`;
document.head.appendChild(notificationCSS);