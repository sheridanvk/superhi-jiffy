const API_KEY = '6Ioi7vw9BLJgxOew6OEMrbW99zTsqHL3'
const videosEl = document.querySelector('.videos')
const searchInputEl = document.querySelector('.search-input');
const searchHintDesktopEl = document.querySelector('.search-hint.desktop');
const searchHintMobileEl = document.querySelector('.search-hint.mobile');
const clearSearchEl = document.querySelector('.search-clear');

const handleSearchInput = event => {
  const searchTerm = searchInputEl.value
  
  if ((event.type === 'keyup' && event.key === 'Enter') 
       || event.type === 'click') {
    searchInputEl.blur()
    fetchSearchResults(searchTerm)
  }
}

const fetchSearchResults = searchTerm => {
  showLoading(true)
  
  searchGiphy(searchTerm)
  .then(json => {
    if (json.data.length > 0) {
      const videoSRC = selectRandomGif(json.data)
      displayGif(videoSRC)
      updateSearchHint('search-more', searchTerm)
      searchInputEl.style.display = 'none'
    } else {
      throw new Error();
    }
  })
  .catch(error => {
    updateSearchHint('no-results', searchTerm)
    showLoading(false)
  });
}

const searchGiphy = searchTerm => {  
  return fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=50&offset=0&rating=PG-13&lang=en`)
  .then(response => {
    if (response.status === 200) {
      return response.json()
    } else {
      throw new Error(response);
    }
  })
  .catch(error => {
    updateSearchHint('connection-down')
    showLoading(false)
  });
};

const selectRandomGif = gifs => {
  const randomIndex = Math.floor(Math.random() * gifs.length)
  return gifs[randomIndex].images.original.mp4
}

const displayGif = src => {
  const video = createVideo(src)
  videosEl.style.display = 'grid'
  videosEl.appendChild(video)
  
  video.addEventListener('loadeddata', event => {
    video.classList.add('visible')
    document.body.classList.add('has-results')
    showLoading(false)
  }) 
  
  video.muted = true
  video.playsInline = true
  video.play()
}

const createVideo = src => {
  const videoEl = document.createElement('video')

  videoEl.src = src
  videoEl.autoplay = true
  videoEl.loop = true
  videoEl.classList.add('full-area')
  
  return videoEl
}

const showLoading = state => {
  if (state) {
    document.body.classList.add('loading')
  } else {
    document.body.classList.remove('loading')
  }
}

const updateSearchHint = (message, searchTerm = '') => {
  if (message === "no-results") {
    searchHintDesktopEl.innerHTML = `No results for ${searchTerm}`
    searchHintMobileEl.innerHTML = `No results for ${searchTerm}`
  } else if (message === "search-more") {
    searchHintDesktopEl.innerHTML = `Hit Enter to search for more ${searchTerm}`
    searchHintMobileEl.innerHTML = `Tap to search for more ${searchTerm}`
  } else if (message === "clear") { 
    searchHintDesktopEl.innerHTML = ''
    searchHintMobileEl.innerHTML = ''
  } else if (message === "connection-down") {
    searchHintDesktopEl.innerHTML = `Sorry, we can't seem to connect to Giphy. Try later!`
    searchHintMobileEl.innerHTML = `Sorry, we can't seem to connect to Giphy. Try later!`
  }
}

const clearSearch = event => {
  document.body.classList.remove('has-results')
  
  videosEl.innerHTML = ''
  updateSearchHint('clear')
  searchInputEl.style.display = 'inline-block'
  searchInputEl.value = ''
  
  searchInputEl.focus()
}

document.addEventListener('keyup', handleSearchInput);
videosEl.addEventListener('click', handleSearchInput);
searchHintMobileEl.addEventListener('click', handleSearchInput);
clearSearchEl.addEventListener('click', clearSearch);

document.addEventListener('keyup', event => {
  if(event.key === 'Escape') {
    clearSearch();
  }
});