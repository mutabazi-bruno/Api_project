const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const movieList = document.getElementById("movieList");
const movieDetails = document.getElementById("movieDetails");

searchBtn.addEventListener("click", () => {
    const movieName = searchInput.value.trim();
    if (movieName) {
        fetchMovies(movieName);
    } else {
        alert("Please enter a movie name!");
    }
});


async function fetchMovies(query) {
    const API_KEY = config.API_KEY;
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
    const data = await response.json();

    if (data.Response === "True") {
        movieList.innerHTML = "";
        movieDetails.style.display = "none"; 

        data.Search.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");
            movieCard.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}">
                <h3>${movie.Title} (${movie.Year})</h3>
            `;
            movieCard.addEventListener("click", () => fetchMovieDetails(movie.imdbID));
            movieList.appendChild(movieCard);
        });
    } else {
        movieList.innerHTML = `<p>❌ No movies found. Try another search.</p>`;
    }
}


async function fetchMovieDetails(imdbID) {
    const API_KEY = config.API_KEY;
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
    const data = await response.json();

    if (data.Response === "True") {
        movieDetails.style.display = "block";
        movieDetails.innerHTML = `
            <h2>${data.Title} (${data.Year})</h2>
            <img src="${data.Poster}" alt="${data.Title}">
            <p><strong>Plot:</strong> ${data.Plot}</p>
            <p><strong>Director:</strong> ${data.Director}</p>
            <p><strong>Actors:</strong> ${data.Actors}</p>
            <p><strong>IMDB Rating:</strong> ⭐ ${data.imdbRating}</p>
        `;
    }
}
