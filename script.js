const JSONBIN_BIN_ID = '6a7df097da38895dfee06e24';
const JSONBIN_MASTER_KEY = '$2a$10$l.kHH97uW6n49bIscDhjCud6KDzGxKKWAD9p8rCSY9Hg3F10z8BAi';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// Структура данных приложения
let appData = {
    movies: [
        { id: 1, title: "Пример фильма", url: "https://vk.com/video_ext.php?..." }
    ],
    series: [],
    favorites: {
        movies: [],
        series: []
    }
};

let currentAccount = localStorage.getItem('currentAccount') || null;
let currentSeriesId = null;
let currentSeasonNum = null;
let currentEpisodeId = null;

// Словарь переводов
const translations = {
    ru: {
        nav_movies: "Фильмы",
        nav_series: "Сериалы",
        nav_favorites: "Избранное",
        nav_add: "Добавить",
        nav_contact: "Контакты",
        nav_settings: "Настройки",
        nav_account: "Аккаунт",
        movies_title: "Каталог фильмов",
        series_title: "Каталог сериалов",
        favorites_title: "Избранное аккаунта",
        fav_movies_heading: "Избранные фильмы",
        fav_series_heading: "Избранные сериалы",
        add_title: "Управление контентом",
        contact_title: "Связь со мной",
        settings_title: "Настройки",
        account_title: "Управление аккаунтом",
        search_movie_placeholder: "🔍 Найти фильм...",
        search_series_placeholder: "🔍 Найти сериал...",
        delete_series_btn: "Удалить сериал",
        seasons_label: "Сезоны:",
        episodes_label: "Серии:",
        select_episode_prompt: "Выберите серию для воспроизведения",
        fullscreen_btn: "⛶ На полный экран",
        add_movie_heading: "Добавить фильм",
        movie_title_label: "Название фильма:",
        movie_title_placeholder: "Например: Матрица",
        vk_link_label: "Ссылка VK Видео:",
        vk_link_placeholder: "Вставьте ссылку https://vkvideo.ru/...",
        save_movie_btn: "Сохранить фильм",
        add_episode_heading: "Добавить серии в сериал",
        target_series_label: "Выберите сериал или создайте новый:",
        create_new_series_option: "➕ Создать новый сериал...",
        new_series_title_label: "Название нового сериала:",
        new_series_placeholder: "Например: Во все тяжкие",
        season_num_label: "Номер сезона (только цифра, например: 1):",
        episodes_list_label: "Список серий (формат: Номер серии, Ссылка):",
        add_episodes_btn: "Добавить серии",
        contact_heading: "Написать мне сообщение",
        contact_desc: "Заполни форму ниже, и сообщение придет на почту (через Formspree).",
        email_label: "Твой Email:",
        message_label: "Сообщение:",
        message_placeholder: "Текст твоего сообщения...",
        send_btn: "Отправить сообщение",
        language_heading: "Выбор языка",
        language_label: "Язык интерфейса:",
        acc_name_label: "Название аккаунта:",
        acc_pass_label: "Пароль аккаунта:",
        acc_submit_btn: "Войти / Создать",
        acc_logout_btn: "Выйти из аккаунта"
    },
    en: {
        nav_movies: "Movies",
        nav_series: "Series",
        nav_favorites: "Favorites",
        nav_add: "Add",
        nav_contact: "Contact",
        nav_settings: "Settings",
        nav_account: "Account",
        movies_title: "Movie Catalog",
        series_title: "Series Catalog",
        favorites_title: "Account Favorites",
        fav_movies_heading: "Favorite Movies",
        fav_series_heading: "Favorite Series",
        add_title: "Content Management",
        contact_title: "Contact Me",
        settings_title: "Settings",
        account_title: "Account Management",
        search_movie_placeholder: "🔍 Search movie...",
        search_series_placeholder: "🔍 Search series...",
        delete_series_btn: "Delete Series",
        seasons_label: "Seasons:",
        episodes_label: "Episodes:",
        select_episode_prompt: "Select an episode to play",
        fullscreen_btn: "⛶ Fullscreen",
        add_movie_heading: "Add Movie",
        movie_title_label: "Movie Title:",
        movie_title_placeholder: "e.g., Matrix",
        vk_link_label: "VK Video Link:",
        vk_link_placeholder: "Paste link https://vkvideo.ru/...",
        save_movie_btn: "Save Movie",
        add_episode_heading: "Add Episodes to Series",
        target_series_label: "Select series or create new:",
        create_new_series_option: "➕ Create new series...",
        new_series_title_label: "New Series Title:",
        new_series_placeholder: "e.g., Breaking Bad",
        season_num_label: "Season Number (digit, e.g. 1):",
        episodes_list_label: "Episodes List (format: Episode Num, Link):",
        add_episodes_btn: "Add Episodes",
        contact_heading: "Send me a message",
        contact_desc: "Fill out the form below to send an email via Formspree.",
        email_label: "Your Email:",
        message_label: "Message:",
        message_placeholder: "Your message text...",
        send_btn: "Send Message",
        language_heading: "Language Choice",
        language_label: "Interface Language:",
        acc_name_label: "Account Name:",
        acc_pass_label: "Account Password:",
        acc_submit_btn: "Login / Register",
        acc_logout_btn: "Log out"
    },
    be: {
        nav_movies: "Фільмы",
        nav_series: "Серыялы",
        nav_favorites: "Выбранае",
        nav_add: "Дадаць",
        nav_contact: "Кантакты",
        nav_settings: "Налады",
        nav_account: "Акаўнт",
        movies_title: "Каталог фільмаў",
        series_title: "Каталог серыялаў",
        favorites_title: "Выбранае акаўнта",
        fav_movies_heading: "Выбраныя фільмы",
        fav_series_heading: "Выбраныя серыялы",
        add_title: "Кіраванне кантэнтам",
        contact_title: "Сувязь са мной",
        settings_title: "Налады",
        account_title: "Кіраванне акаўнтам",
        search_movie_placeholder: "🔍 Знайсці фільм...",
        search_series_placeholder: "🔍 Знайсці серыял...",
        delete_series_btn: "Выдаліць серыял",
        seasons_label: "Сезоны:",
        episodes_label: "Серыі:",
        select_episode_prompt: "Выберыце серыю для прайгравання",
        fullscreen_btn: "⛶ На ўвесь экран",
        add_movie_heading: "Дадаць фільм",
        movie_title_label: "Назва фільма:",
        movie_title_placeholder: "Напрыклад: Матрыца",
        vk_link_label: "Спасылка VK Відео:",
        vk_link_placeholder: "Устаўце спасылку https://vkvideo.ru/...",
        save_movie_btn: "Захаваць фільм",
        add_episode_heading: "Дадаць серыі ў серыял",
        target_series_label: "Выберыце серыял або стварыце новы:",
        create_new_series_option: "➕ Стварыць новы серыял...",
        new_series_title_label: "Назва новага серыяла:",
        new_series_placeholder: "Напрыклад: Ва ўсе цяжкія",
        season_num_label: "Нумар сезона (толькі лічба, напрыклад: 1):",
        episodes_list_label: "Спіс серый (фармат: Нумар серыі, Спасылка):",
        add_episodes_btn: "Дадаць серыі",
        contact_heading: "Напісаць мне паведамленне",
        contact_desc: "Запоўні форму ніжэй, і паведамленне прыйдзе на пошту.",
        email_label: "Твой Email:",
        message_label: "Паведамленне:",
        message_placeholder: "Тэкст твайго паведамлення...",
        send_btn: "Адправіць паведамленне",
        language_heading: "Выбар мовы",
        language_label: "Мова інтэрфейсу:",
        acc_name_label: "Назва акаўнта:",
        acc_pass_label: "Пароль акаўнта:",
        acc_submit_btn: "Увайсці / Стварыць",
        acc_logout_btn: "Выйсці з акаўнта"
    },
    pl: {
        nav_movies: "Filmy",
        nav_series: "Seriale",
        nav_favorites: "Ulubione",
        nav_add: "Dodaj",
        nav_contact: "Kontakt",
        nav_settings: "Ustawienia",
        nav_account: "Konto",
        movies_title: "Katalog filmów",
        series_title: "Katalog seriali",
        favorites_title: "Ulubione konta",
        fav_movies_heading: "Ulubione filmy",
        fav_series_heading: "Ulubione seriale",
        add_title: "Zarządzanie treścią",
        contact_title: "Kontakt ze mną",
        settings_title: "Ustawienia",
        account_title: "Zarządzanie kontem",
        search_movie_placeholder: "🔍 Znajdź film...",
        search_series_placeholder: "🔍 Znajdź serial...",
        delete_series_btn: "Usuń serial",
        seasons_label: "Sezony:",
        episodes_label: "Odcinki:",
        select_episode_prompt: "Wybierz odcinek do odtworzenia",
        fullscreen_btn: "⛶ Pełny ekran",
        add_movie_heading: "Dodaj film",
        movie_title_label: "Tytuł filmu:",
        movie_title_placeholder: "np. Matrix",
        vk_link_label: "Link VK Video:",
        vk_link_placeholder: "Wklej link https://vkvideo.ru/...",
        save_movie_btn: "Zapisz film",
        add_episode_heading: "Dodaj odcinki do serialu",
        target_series_label: "Wybierz serial lub utwórz nowy:",
        create_new_series_option: "➕ Utwórz nowy serial...",
        new_series_title_label: "Tytuł nowego serialu:",
        new_series_placeholder: "np. Breaking Bad",
        season_num_label: "Numer sezonu (cyfra, np. 1):",
        episodes_list_label: "Lista odcinków (format: Numer odcinka, Link):",
        add_episodes_btn: "Dodaj odcinki",
        contact_heading: "Napisz do mnie",
        contact_desc: "Wypełnij formularz poniżej, aby wysłać wiadomość.",
        email_label: "Twój Email:",
        message_label: "Wiadomość:",
        message_placeholder: "Treść wiadomości...",
        send_btn: "Wyślij wiadomość",
        language_heading: "Wybór języka",
        language_label: "Język interfejsu:",
        acc_name_label: "Nazwa konta:",
        acc_pass_label: "Hasło konta:",
        acc_submit_btn: "Zaloguj / Utwórz",
        acc_logout_btn: "Wyloguj się"
    }
};

let currentLang = localStorage.getItem('siteLang') || 'ru';

// Загрузка данных из JSONBin.io
async function loadDataFromCloud() {
    try {
        const response = await fetch(JSONBIN_URL, {
            headers: {
                'X-Master-Key': JSONBIN_MASTER_KEY
            }
        });
        if (response.ok) {
            const data = await response.json();
            if (data && data.record) {
                appData = data.record;
            }
        }
    } catch (e) {
        console.error("Ошибка загрузки из облака", e);
    }
}

// Сохранение данных в JSONBin.io
async function saveDataToCloud() {
    try {
        await fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_MASTER_KEY
            },
            body: JSON.stringify(appData)
        });
    } catch (e) {
        console.error("Ошибка сохранения в облако", e);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadDataFromCloud();
    applyLanguage(currentLang);
    document.getElementById('language-select').value = currentLang;
    updateAccountUI();
    renderMovies();
    renderSeriesList();
    renderFavorites();
    populateTargetSeriesSelect();
});

function switchSection(sectionId, event) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(sectionId + '-section').classList.add('active');
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    if (sectionId === 'favorites') {
        renderFavorites();
    }
}

function formatVkEmbed(url) {
    if (!url) return '';
    if (url.includes('iframe')) {
        const match = url.match(/src="([^"]+)"/);
        return match ? match[1] : url;
    }
    if (url.includes('vkvideo.ru/') || url.includes('vk.com/')) {
        let videoId = '';
        if (url.includes('video-')) {
            const m = url.match(/video-?\d+_\d+/);
            if (m) videoId = m[0];
        } else if (url.includes('oid=') && url.includes('id=')) {
            const oid = new URL(url).searchParams.get('oid');
            const id = new URL(url).searchParams.get('id');
            if (oid && id) videoId = `video${oid}_${id}`;
        }
        if (videoId) {
            const parts = videoId.replace('video', '').split('_');
            if (parts.length === 2) {
                return `https://vk.com/video_ext.php?oid=${parts[0]}&id=${parts[1]}&hd=2`;
            }
        }
    }
    return url;
}

// Фильмы
function renderMovies(filter = '') {
    const grid = document.getElementById('movies-grid');
    grid.innerHTML = '';
    const filtered = appData.movies.filter(m => m.title.toLowerCase().includes(filter.toLowerCase()));
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p class="placeholder-text">Нет фильмов</p>';
        return;
    }

    filtered.forEach(movie => {
        const embedUrl = formatVkEmbed(movie.url);
        const isFav = currentAccount && appData.favorites.movies && appData.favorites.movies.some(f => f.id === movie.id && f.account === currentAccount);
        
        const card = document.createElement('div');
        card.className = 'card';
        card.style.margin = '0';
        card.innerHTML = `
            <div class="video-box" id="movie-box-${movie.id}">
                <iframe src="${embedUrl}" allow="autoplay; encrypted-media; fullscreen; picture-in-picture;" allowfullscreen></iframe>
            </div>
            <div class="card-info">
                <h3>${movie.title}</h3>
                <div class="card-actions">
                    <button class="btn-fullscreen" onclick="makeFullscreen('movie-box-${movie.id}')">${translations[currentLang].fullscreen_btn}</button>
                    <button class="btn-favorite ${isFav ? 'active' : ''}" onclick="toggleFavoriteMovie(${movie.id})">⭐ ${isFav ? 'В избранном' : 'В избранное'}</button>
                    <button class="btn-delete" onclick="deleteMovie(${movie.id})">Удалить</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterMovies() {
    const query = document.getElementById('movie-search').value;
    renderMovies(query);
}

async function addNewMovie() {
    const title = document.getElementById('new-movie-title').value.trim();
    const url = document.getElementById('new-movie-embed').value.trim();
    if (!title || !url) {
        alert("Заполните все поля!");
        return;
    }
    const newId = Date.now();
    appData.movies.push({ id: newId, title, url });
    await saveDataToCloud();
    document.getElementById('new-movie-title').value = '';
    document.getElementById('new-movie-embed').value = '';
    renderMovies();
    alert("Фильм успешно добавлен!");
}

async function deleteMovie(id) {
    if (!confirm("Удалить этот фильм?")) return;
    appData.movies = appData.movies.filter(m => m.id !== id);
    appData.favorites.movies = appData.favorites.movies.filter(m => m.id !== id);
    await saveDataToCloud();
    renderMovies();
    renderFavorites();
}

async function toggleFavoriteMovie(movieId) {
    if (!currentAccount) {
        alert("Сначала войдите в аккаунт!");
        switchSection('account');
        return;
    }
    const movie = appData.movies.find(m => m.id === movieId);
    if (!movie) return;

    if (!appData.favorites.movies) appData.favorites.movies = [];
    const index = appData.favorites.movies.findIndex(f => f.id === movieId && f.account === currentAccount);
    
    if (index > -1) {
        appData.favorites.movies.splice(index, 1);
    } else {
        appData.favorites.movies.push({ ...movie, account: currentAccount });
    }
    await saveDataToCloud();
    renderMovies();
    renderFavorites();
}

// Сериалы
function renderSeriesList(filter = '') {
    const listContainer = document.getElementById('series-list');
    listContainer.innerHTML = '';
    const filtered = appData.series.filter(s => s.title.toLowerCase().includes(filter.toLowerCase()));

    if (filtered.length === 0) {
        listContainer.innerHTML = '<p class="placeholder-text" style="padding:10px;">Нет сериалов</p>';
        return;
    }

    filtered.forEach(series => {
        const item = document.createElement('div');
        item.className = 'series-item' + (currentSeriesId === series.id ? ' active' : '');
        item.innerText = series.title;
        item.onclick = () => selectSeries(series.id);
        listContainer.appendChild(item);
    });
}

function filterSeries() {
    const query = document.getElementById('series-search').value;
    renderSeriesList(query);
}

function selectSeries(seriesId) {
    currentSeriesId = seriesId;
    currentSeasonNum = null;
    currentEpisodeId = null;
    renderSeriesList(document.getElementById('series-search').value);
    
    const series = appData.series.find(s => s.id === seriesId);
    if (!series) return;

    document.getElementById('selected-series-title').innerText = series.title;
    document.getElementById('delete-series-btn').style.display = 'block';
    
    const favBtn = document.getElementById('favorite-series-btn');
    favBtn.style.display = 'block';
    const isFav = currentAccount && appData.favorites.series && appData.favorites.series.some(f => f.id === series.id && f.account === currentAccount);
    favBtn.className = 'btn-favorite ' + (isFav ? 'active' : '');
    favBtn.innerText = isFav ? '⭐ В избранном' : '⭐ В избранное';

    const seasonsBlock = document.getElementById('seasons-block');
    const seasonsContainer = document.getElementById('seasons-buttons-container');
    seasonsContainer.innerHTML = '';
    seasonsBlock.style.display = 'block';
    document.getElementById('episodes-block').style.display = 'none';
    resetPlayer();

    const seasons = Object.keys(series.seasons || {});
    if (seasons.length === 0) {
        seasonsContainer.innerHTML = '<p class="placeholder-text">Нет сезонов</p>';
        return;
    }

    seasons.forEach(seasonNum => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = `Сезон ${seasonNum}`;
        btn.onclick = () => selectSeason(seasonNum);
        seasonsContainer.appendChild(btn);
    });
}

function selectSeason(seasonNum) {
    currentSeasonNum = seasonNum;
    currentEpisodeId = null;
    
    const seasonsContainer = document.getElementById('seasons-buttons-container');
    Array.from(seasonsContainer.children).forEach(b => {
        b.classList.toggle('active', b.innerText.includes(`Сезон ${seasonNum}`));
    });

    const episodesBlock = document.getElementById('episodes-block');
    const episodesContainer = document.getElementById('episodes-buttons-container');
    episodesContainer.innerHTML = '';
    episodesBlock.style.display = 'block';
    resetPlayer();

    const series = appData.series.find(s => s.id === currentSeriesId);
    if (!series || !series.seasons[seasonNum]) return;

    const episodes = series.seasons[seasonNum];
    episodes.forEach(ep => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = `Серия ${ep.number}`;
        btn.onclick = () => selectEpisode(ep);
        episodesContainer.appendChild(btn);
    });
}

function selectEpisode(ep) {
    currentEpisodeId = ep.number;
    const episodesContainer = document.getElementById('episodes-buttons-container');
    Array.from(episodesContainer.children).forEach(b => {
        b.classList.toggle('active', b.innerText.includes(`Серия ${ep.number}`));
    });

    const container = document.getElementById('vk-player-container');
    const embedUrl = formatVkEmbed(ep.url);
    container.innerHTML = `<iframe src="${embedUrl}" allow="autoplay; encrypted-media; fullscreen; picture-in-picture;" allowfullscreen></iframe>`;
}

function resetPlayer() {
    const container = document.getElementById('vk-player-container');
    container.innerHTML = `<p class="placeholder-text">${translations[currentLang].select_episode_prompt}</p>`;
}

async function toggleFavoriteSeries() {
    if (!currentAccount) {
        alert("Сначала войдите в аккаунт!");
        switchSection('account');
        return;
    }
    const series = appData.series.find(s => s.id === currentSeriesId);
    if (!series) return;

    if (!appData.favorites.series) appData.favorites.series = [];
    const index = appData.favorites.series.findIndex(f => f.id === series.id && f.account === currentAccount);
    
    if (index > -1) {
        appData.favorites.series.splice(index, 1);
    } else {
        appData.favorites.series.push({ ...series, account: currentAccount });
    }
    await saveDataToCloud();
    selectSeries(currentSeriesId);
    renderFavorites();
}

async function deleteCurrentSeries() {
    if (!currentSeriesId) return;
    if (!confirm("Удалить этот сериал полностью?")) return;
    
    appData.series = appData.series.filter(s => s.id !== currentSeriesId);
    appData.favorites.series = appData.favorites.series.filter(s => s.id !== currentSeriesId);
    await saveDataToCloud();
    
    currentSeriesId = null;
    document.getElementById('selected-series-title').innerText = "Выберите сериал";
    document.getElementById('favorite-series-btn').style.display = 'none';
    document.getElementById('delete-series-btn').style.display = 'none';
    document.getElementById('seasons-block').style.display = 'none';
    document.getElementById('episodes-block').style.display = 'none';
    resetPlayer();
    renderSeriesList();
    populateTargetSeriesSelect();
    renderFavorites();
}

async function addNewEpisode() {
    const targetSelect = document.getElementById('target-series-select').value;
    const seasonNum = document.getElementById('new-season-title').value.trim();
    const bulkText = document.getElementById('bulk-episodes').value.trim();

    if (!seasonNum || !bulkText) {
        alert("Заполните номер сезона и список серий!");
        return;
    }

    let seriesId, seriesTitle;
    if (targetSelect === 'new') {
        seriesTitle = document.getElementById('new-series-title').value.trim();
        if (!seriesTitle) {
            alert("Введите название нового сериала!");
            return;
        }
        seriesId = Date.now();
        appData.series.push({ id: seriesId, title: seriesTitle, seasons: {} });
    } else {
        seriesId = parseInt(targetSelect);
        const s = appData.series.find(x => x.id === seriesId);
        seriesTitle = s ? s.title : '';
    }

    const series = appData.series.find(x => x.id === seriesId);
    if (!series.seasons) series.seasons = {};
    if (!series.seasons[seasonNum]) series.seasons[seasonNum] = [];

    const lines = bulkText.split('\n');
    lines.forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 2) {
            const epNum = parts[0].trim();
            const epUrl = parts.slice(1).join(',').trim();
            if (epNum && epUrl) {
                series.seasons[seasonNum].push({ number: epNum, url: epUrl });
            }
        }
    });

    await saveDataToCloud();
    alert("Серии успешно добавлены!");
    document.getElementById('bulk-episodes').value = '';
    document.getElementById('new-season-title').value = '';
    populateTargetSeriesSelect();
    renderSeriesList();
    if (currentSeriesId === seriesId) {
        selectSeries(seriesId);
    }
}

function checkNewSeriesInput() {
    const val = document.getElementById('target-series-select').value;
    const group = document.getElementById('new-series-name-group');
    group.style.display = (val === 'new') ? 'block' : 'none';
}

function populateTargetSeriesSelect() {
    const select = document.getElementById('target-series-select');
    select.innerHTML = '<option value="new" data-i18n="create_new_series_option">➕ Создать новый сериал...</option>';
    appData.series.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.innerText = s.title;
        select.appendChild(opt);
    });
    checkNewSeriesInput();
}

// Избранное
function renderFavorites() {
    const favMoviesGrid = document.getElementById('favorite-movies-grid');
    const favSeriesGrid = document.getElementById('favorite-series-grid');
    favMoviesGrid.innerHTML = '';
    favSeriesGrid.innerHTML = '';

    if (!currentAccount) {
        favMoviesGrid.innerHTML = '<p class="placeholder-text">Войдите в аккаунт, чтобы видеть избранное</p>';
        favSeriesGrid.innerHTML = '<p class="placeholder-text">Войдите в аккаунт, чтобы видеть избранное</p>';
        return;
    }

    const userMovies = (appData.favorites.movies || []).filter(m => m.account === currentAccount);
    const userSeries = (appData.favorites.series || []).filter(s => s.account === currentAccount);

    if (userMovies.length === 0) {
        favMoviesGrid.innerHTML = '<p class="placeholder-text">Нет избранных фильмов</p>';
    } else {
        userMovies.forEach(movie => {
            const embedUrl = formatVkEmbed(movie.url);
            const card = document.createElement('div');
            card.className = 'card';
            card.style.margin = '0';
            card.innerHTML = `
                <div class="video-box" id="fav-movie-${movie.id}">
                    <iframe src="${embedUrl}" allow="autoplay; encrypted-media; fullscreen; picture-in-picture;" allowfullscreen></iframe>
                </div>
                <div class="card-info">
                    <h3>${movie.title}</h3>
                    <div class="card-actions">
                        <button class="btn-fullscreen" onclick="makeFullscreen('fav-movie-${movie.id}')">${translations[currentLang].fullscreen_btn}</button>
                        <button class="btn-favorite active" onclick="toggleFavoriteMovie(${movie.id})">⭐ В избранном</button>
                    </div>
                </div>
            `;
            favMoviesGrid.appendChild(card);
        });
    }

    if (userSeries.length === 0) {
        favSeriesGrid.innerHTML = '<p class="placeholder-text">Нет избранных сериалов</p>';
    } else {
        userSeries.forEach(series => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.margin = '0';
            card.innerHTML = `
                <div class="card-info">
                    <h3>${series.title}</h3>
                    <div class="card-actions">
                        <button class="btn-save" onclick="switchSection('series'); selectSeries(${series.id});">Смотреть</button>
                        <button class="btn-favorite active" onclick="currentSeriesId = ${series.id}; toggleFavoriteSeries();">⭐ В избранном</button>
                    </div>
                </div>
            `;
            favSeriesGrid.appendChild(card);
        });
    }
}

// Аккаунт
function loginOrRegisterAccount() {
    const username = document.getElementById('acc-username-input').value.trim();
    const pass = document.getElementById('acc-password-input').value;
    
    if (!username || pass !== '112113') {
        alert("Неверное имя аккаунта или пароль! (Пароль администратора: 112113)");
        return;
    }

    currentAccount = username;
    localStorage.setItem('currentAccount', username);
    updateAccountUI();
    renderMovies();
    renderFavorites();
    if (currentSeriesId) selectSeries(currentSeriesId);
    alert("Успешный вход в аккаунт: " + username);
}

function logoutAccount() {
    currentAccount = null;
    localStorage.removeItem('currentAccount');
    updateAccountUI();
    document.getElementById('acc-username-input').value = '';
    document.getElementById('acc-password-input').value = '';
    renderMovies();
    renderFavorites();
    if (currentSeriesId) selectSeries(currentSeriesId);
    alert("Вы вышли из аккаунта.");
}

function updateAccountUI() {
    const infoP = document.getElementById('current-account-info');
    const logoutBtn = document.getElementById('logout-btn');
    if (currentAccount) {
        infoP.innerText = `Текущий аккаунт: ${currentAccount}`;
        logoutBtn.style.display = 'inline-block';
    } else {
        infoP.innerText = "Вы не вошли в аккаунт. Введите логин и пароль (112113).";
        logoutBtn.style.display = 'none';
    }
}

// Настройки и Язык
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('siteLang', lang);
    applyLanguage(lang);
}

function applyLanguage(lang) {
    const dict = translations[lang] || translations['ru'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerText = dict[key];
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) {
            el.placeholder = dict[key];
        }
    });
}

function makeFullscreen(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (container.requestFullscreen) {
        container.requestFullscreen();
    } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
    }
}
