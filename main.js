let movieList = []

const addFilmInputNode = document.querySelector ('.js-add-film-input')
const addFilmButtonNode = document.querySelector ('.js-add-film-button')
const movieListBoxWrapperNode = document.querySelector ('.js-movie-list-box-wrapper')
const incorrectInputWarningNode = document.querySelector ('.js-incorrect-input-warning')
const emptyInputWarningNode = document.querySelector ('.js-empty-input-warning')

const INPUT_EMPTY = ''
const INPUT_EMPTY_TEXT = 'Поле не должно быть пустым'
const INPUT_WARNING_TEXT = `Название не должно начинаться с пробела или символов`

loadFromLocalStorage ()

render ()

//Создание и добавление элемента в массив

function createNewMovie () {
    const newMovie = {
        name: addFilmInputNode.value,
        done: false,
        viewed: false,
        id: `${Math.random ()}`
    }
    
    movieList.push(newMovie)
}

// Рендеринг

function render () { 
    
    let movieListHTML = ''
    
    movieList.forEach(newMovie => {
        if (newMovie.done) {
            return
        }
        
        movieListHTML += 
            `
            <li class="movie-plate ${!!newMovie.viewed ? 'movie-viewed' : ""}">
                    
            <label class="circle-done js-circle-done ${!!newMovie.viewed ? 'circle-done-colored' : ""}" data-id="${newMovie.id}"></label>
            <span class="movie-name js-movie-name" data-id="${newMovie.id}">${newMovie.name}</span>
            <button class="remove-movie-btn" data-id="${newMovie.id}"></button> 
            
            </li>
            ` 
        })
            
    movieListBoxWrapperNode.innerHTML = `<ul class="movieList">${movieListHTML}</ul>`
    
    addFilmInputNode.value = INPUT_EMPTY
    
    saveToLocalStorage ()
}

//функция активации чекбокса
        
function movieChecked () {
    
    const selectedMoviePlate = event.target
    const moviePlateEl = selectedMoviePlate.closest('.movie-plate')
    
    if (selectedMoviePlate.tagName !== 'LABEL') {
        return
    }

    moviePlateEl.classList.toggle ('movie-viewed')
    selectedMoviePlate.classList.toggle('circle-done-colored')
    
    const id = event.target.dataset.id
    
    toggleViewedStatus (id)
    
    saveToLocalStorage ()
}

//функция смены статуса чекбокса

function toggleViewedStatus (id) {
    movieList.forEach(newMovie => {
        if (newMovie.id === id) {
            
            newMovie.viewed = !newMovie.viewed
        }
    })
    
}
//функция удаления фильма

function deleteMovie (id) {
    movieList.forEach(newMovie => {
        if (newMovie.id === id) {
            
            newMovie.done = true
        }
    })
    
    render ()
}



//Локальное хранилище

function saveToLocalStorage () {
    localStorage.setItem('checkedFilm', JSON.stringify(movieList))
}

function loadFromLocalStorage () {

    if (localStorage.getItem ('checkedFilm') === null) {
        return
    }

    movieList = JSON.parse(localStorage.getItem('checkedFilm'))
    
    return movieList
}

// функция добавления и отрисовки

function addAndRender () {
    let inputValue = addFilmInputNode.value

    if (!inputValue.length) {
        emptyInputWarningNode.innerText = INPUT_EMPTY_TEXT
        emptyInputWarningNode.removeAttribute ('hidden' , '')
        return
    }

    createNewMovie ()
    
    render ()

    saveToLocalStorage ()

    addFilmButtonNode.classList.add ('button-disabled')
}

// Функция корректности ввода

function isCorrectInputValue () {

    let inputValue = addFilmInputNode.value

    if (inputValue.match (/^\s/) || inputValue.match (/^\p{P}/gu) || inputValue.match (/^\p{S}/gu)) {
        incorrectInputWarningNode.innerText = INPUT_WARNING_TEXT
        incorrectInputWarningNode.removeAttribute ('hidden', )    
        emptyInputWarningNode.setAttribute ('hidden' , '')
        addFilmButtonNode.setAttribute ('disabled', '')
        return
    }

    if (inputValue.length > 0) {
        addFilmButtonNode.classList.remove ('button-disabled')
    }
    
    if (inputValue.length <= 0) {
        addFilmButtonNode.classList.add ('button-disabled')
    }
    
    addFilmButtonNode.removeAttribute ('disabled', )
    emptyInputWarningNode.setAttribute ('hidden' , '')
    incorrectInputWarningNode.setAttribute ('hidden', '')
}
//Слушатели событий

movieListBoxWrapperNode.addEventListener ('click', (event) => {
    
    if (event.target.tagName !== 'BUTTON') {
        return
    }
    
    const id = event.target.dataset.id
    
    deleteMovie (id)
})

addFilmButtonNode.addEventListener (`click`, addAndRender)

movieListBoxWrapperNode.addEventListener ('click', movieChecked)

addFilmInputNode.addEventListener (`input`, isCorrectInputValue)
