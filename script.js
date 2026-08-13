// --- Настройки облачного хранилища JSONBin ---
const BIN_ID = '6a7dec18da38895dfee05a77';
const API_KEY = 'ВАШ_MASTER_KEY_ЗДЕСЬ'; // Замените на ваш Master Key от JSONBin

// Базовые данные сайта
let siteData = {
    movies: [
        {
            title: "Пример фильма",
            vkEmbed: '<iframe src="https://vk.com/video_ext.php?oid=-200000000&id=456239000&hd=2" width="100%" height="100%" allow="autoplay; encrypted-media; fullscreen; picture-in-picture;" frameborder="0" allowfullscreen></iframe>'
        }
    ],
    series: [
        {
            id: 1,
            title: "Во все тяжкие",
            seasons: {
                "1": [
                    { number: "1", vkEmbed: '<iframe src="https://vk.com/video_ext.php?oid=-11111&id=1111&hd=2" width="100%" height="100%" allowfullscreen></iframe>' }
                ]
            }
        }
    ]
};

let currentLang = localStorage.getItem('my_custom_lang') || 'ru';
let currentAccount = JSON.parse(localStorage.getItem('my_active_account')) || null;

// --- Функции синхронизации с облаком JSONBin ---
async function loadDataFromCloud() {
    try {
        let response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': API_KEY
            }
        });
        let data = await response.json();
        if (data && data.record) {
            // Если в облаке есть данные, используем их
            if (data.record.movies) siteData.movies = data.record.movies;
            if (data.record.series) siteData.series = data.record.series;
        }
    } catch (error) {
        console.error('Ошибка загрузки из облака, используем локальные данные:', error);
        // Резервное чтение из localStorage, если нет интернета
        if (localStorage.getItem('my_custom_movies')) {
            try { siteData.movies = JSON.parse(localStorage.getItem('my_custom_movies')); } catch (e) { console.error(e); }
        }
        if (localStorage.getItem('my_custom_series')) {
            try { siteData.series = JSON.parse(localStorage.getItem('my_custom_series')); } catch (e) { console.error(e); }
        }
    }
    // После загрузки обновляем интерфейс
    initMovies();
    initSeries();
    updateFavorites();
}

async function saveDataToCloud() {
    // Дублируем в localStorage для надежности
    localStorage.setItem('my_custom_movies', JSON.stringify(siteData.movies));
    localStorage.setItem('my_custom_series', JSON.stringify(siteData.series));

    try {
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify({
                movies: siteData.movies,
                series: siteData.series
            })
        });
    } catch (error) {
        console.error('Ошибка сохранения данных в облако:', error);
    }
}

// --- Переводы и локализация ---
const translations = {
    ru: {
        logo: "🎥 Моя Медиатека",
        nav_movies: "Фильмы",
        nav_series: "Сериалы",
        nav_favorites: "⭐ Избранное",
        nav_add: "➕ Добавить",
        nav_contact: "✉️ Контакты",
        nav_settings: "⚙️ Настройки",
        nav_account: "👤 Аккаунт",
        movies_title: "Каталог фильмов",
        search_movie_placeholder: "🔍 Найти фильм...",
        series_title: "Каталог сериалов",
        search_series_placeholder: "🔍 Найти сериал...",
        select_series_prompt: "Выберите сериал",
        delete_series_btn: "Удалить сериал",
        delete_season_btn: "Удалить сезон",
        delete_episode_btn: "Удалить серию",
        seasons_label: "Сезоны:",
        episodes_label: "Серии:",
        select_episode_prompt: "Выберите серию для воспроизведения",
        fullscreen_btn: "⛶ На полный экран",
        favorites_title: "Избранное аккаунта",
        fav_movies_heading: "Избранные фильмы",
        fav_series_heading: "Избранные сериалы",
        fav_btn_add: "⭐ В избранное",
        fav_btn_added: "⭐ В избранном",
        fav_login_required: "Войдите в аккаунт, чтобы добавлять в избранное!",
        remove_from_fav: "❌ Убрать из избранного",
        add_title: "Управление контентом",
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
        contact_title: "Связь со мной",
        contact_heading: "Написать мне сообщение",
        contact_desc: "Заполни форму ниже, и сообщение придет на почту (через Formspree).",
        email_label: "Твой Email:",
        message_label: "Сообщение:",
        message_placeholder: "Текст твоего сообщения...",
        send_btn: "Отправить сообщение",
        settings_title: "Настройки",
        language_heading: "Выбор языка",
        language_label: "Язык интерфейса:",
        account_title: "Управление аккаунтом",
        acc_name_label: "Название аккаунта:",
        acc_pass_label: "Пароль аккаунта:",
        acc_submit_btn: "Войти / Создать",
        acc_logout_btn: "Выйти из аккаунта",
        delete_btn: "Удалить",
        nothing_found: "Ничего не найдено",
        no_seasons: "Нет сезонов",
        no_episodes: "В этом сезоне нет серий",
        pass_prompt: "Введите пароль аккаунта или администратора (112113):",
        wrong_pass: "Неверный пароль!",
        fill_fields: "Заполните оба поля!",
        invalid_vk: "Неверная ссылка VK.",
        delete_movie_confirm: "Удалить этот фильм?",
        fill_season_episodes: "Заполните номер сезона и список серий!",
        enter_series_name: "Введите название нового сериала!",
        episodes_added: "Все серии добавлены!",
        delete_series_confirm: "Точно удалить сериал",
        delete_season_confirm: "Точно удалить сезон",
        delete_episode_confirm: "Точно удалить серию",
        season_word: "Сезон",
        episode_word: "Серия",
        acc_success: "Успешный вход в аккаунт: ",
        acc_created: "Аккаунт успешно создан и осуществлен вход: "
    },
    be: {
        logo: "🎥 Мая Медыятэка",
        nav_movies: "Фільмы",
        nav_series: "Серыялы",
        nav_favorites: "⭐ Выбранае",
        nav_add: "➕ Дадаць",
        nav_contact: "✉️ Кантакты",
        nav_settings: "⚙️ Налады",
        nav_account: "👤 Аккаунт",
        movies_title: "Каталог фільмаў",
        search_movie_placeholder: "🔍 Знайсці фільм...",
        series_title: "Каталог серыялаў",
        search_series_placeholder: "🔍 Знайсці серыял...",
        select_series_prompt: "Выберыце серыял",
        delete_series_btn: "Выдаліць серыял",
        delete_season_btn: "Выдаліць сезон",
        delete_episode_btn: "Выдаліць серыю",
        seasons_label: "Сезоны:",
        episodes_label: "Серыі:",
        select_episode_prompt: "Выберыце серыю для прайгравання",
        fullscreen_btn: "⛶ На ўвесь экран",
        favorites_title: "Выбранае акаўнта",
        fav_movies_heading: "Выбраныя фільмы",
        fav_series_heading: "Выбраныя серыялы",
        fav_btn_add: "⭐ У выбранае",
        fav_btn_added: "⭐ У выбраным",
        fav_login_required: "Увайдзіце ў акаўнт, каб дадаваць у выбранае!",
        remove_from_fav: "❌ Прыбраць з выбранага",
        add_title: "Кіраванне кантэнтам",
        add_movie_heading: "Дадаць фільм",
        movie_title_label: "Назва фільма:",
        movie_title_placeholder: "Напрыклад: Матрыца",
        vk_link_label: "Спасылка VK Відэа:",
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
        contact_title: "Сувязь са мной",
        contact_heading: "Напісаць мне паведамленне",
        contact_desc: "Запоўні форму ніжэй, і паведамленне прыйдзе на пошту (праз Formspree).",
        email_label: "Твой Email:",
        message_label: "Паведамленне:",
        message_placeholder: "Тэкст твайго паведамлення...",
        send_btn: "Адправіць паведамленне",
        settings_title: "Налады",
        language_heading: "Выбар мовы",
        language_label: "Мова інтэрфейсу:",
        account_title: "Кіраванне акаўнтам",
        acc_name_label: "Назва акаўнта:",
        acc_pass_label: "Пароль акаўнта:",
        acc_submit_btn: "Увайсці / Стварыць",
        acc_logout_btn: "Выйсці з акаўнта",
        delete_btn: "Выдаліць",
        nothing_found: "Нячога не знойдзена",
        no_seasons: "Няма сезонаў",
        no_episodes: "У гэтым сезоне няма серый",
        pass_prompt: "Увядзіце пароль акаўнта або адміністратара (112113):",
        wrong_pass: "Няправільны пароль!",
        fill_fields: "Запоўніце абодва палі!",
        invalid_vk: "Няправільная спасылка VK.",
        delete_movie_confirm: "Выдаліць гэты фільм?",
        fill_season_episodes: "Запоўніце нумар сезона і спіс серый!",
        enter_series_name: "Увядзіце назву новага серыяла!",
        episodes_added: "Усе серыі дададзены!",
        delete_series_confirm: "Дакладна выдаліць серыял",
        delete_season_confirm: "Дакладна выдаліць сезон",
        delete_episode_confirm: "Дакладна выдаліць серыю",
        season_word: "Сезон",
        episode_word: "Серыя",
        acc_success: "Паспяховы ўваход у акаўнт: ",
        acc_created: "Акаўнт паспяхова створаны і выкананы ўваход: "
    },
    pl: {
        logo: "🎥 Moja Mediateka",
        nav_movies: "Filmy",
        nav_series: "Seriale",
        nav_favorites: "⭐ Ulubione",
        nav_add: "➕ Dodaj",
        nav_contact: "✉️ Kontakt",
        nav_settings: "⚙️ Ustawienia",
        nav_account: "👤 Konto",
        movies_title: "Katalog filmów",
        search_movie_placeholder: "🔍 Znajdź film...",
        series_title: "Katalog seriali",
        search_series_placeholder: "🔍 Znajdź serial...",
        select_series_prompt: "Wybierz serial",
        delete_series_btn: "Usuń serial",
        delete_season_btn: "Usuń sezon",
        delete_episode_btn: "Usuń odcinek",
        seasons_label: "Sezony:",
        episodes_label: "Odcinki:",
        select_episode_prompt: "Wybierz odcinek do odtworzenia",
        fullscreen_btn: "⛶ Pełny ekran",
        favorites_title: "Ulubione konta",
        fav_movies_heading: "Ulubione filmy",
        fav_series_heading: "Ulubione seriale",
        fav_btn_add: "⭐ Do ulubionych",
        fav_btn_added: "⭐ W ulubionych",
        fav_login_required: "Zaloguj się na konto, aby dodawać do ulubionych!",
        remove_from_fav: "❌ Usuń z ulubionych",
        add_title: "Zarządzanie treścią",
        add_movie_heading: "Dodaj film",
        movie_title_label: "Tytuł filmu:",
        movie_title_placeholder: "Na przykład: Matrix",
        vk_link_label: "Link VK Video:",
        vk_link_placeholder: "Wklej link https://vkvideo.ru/...",
        save_movie_btn: "Zapisz film",
        add_episode_heading: "Dodaj odcinki do serialu",
        target_series_label: "Wybierz serial lub utwórz nowy:",
        create_new_series_option: "➕ Utwórz nowy serial...",
        new_series_title_label: "Tytuł nowego serialu:",
        new_series_placeholder: "Na przykład: Breaking Bad",
        season_num_label: "Numer sezonu (tylko cyfra, np. 1):",
        episodes_list_label: "Lista odcinków (format: Numer odcinka, Link):",
        add_episodes_btn: "Dodaj odcinki",
        contact_title: "Kontakt ze mną",
        contact_heading: "Napisz do mnie wiadomość",
        contact_desc: "Wypełnij formularz poniżej, a wiadomość dotrze na e-mail (przez Formspree).",
        email_label: "Twój Email:",
        message_label: "Wiadomość:",
        message_placeholder: "Tekst Twojej wiadomości...",
        send_btn: "Wyślij wiadomość",
        settings_title: "Ustawienia",
        language_heading: "Wybór języka",
        language_label: "Język interfejsu:",
        account_title: "Zarządzanie kontem",
        acc_name_label: "Nazwa konta:",
        acc_pass_label: "Hasło konta:",
        acc_submit_btn: "Zaloguj / Utwórz",
        acc_logout_btn: "Wyloguj się",
        delete_btn: "Usuń",
        nothing_found: "Nic nie znaleziono",
        no_seasons: "Brak sezonów",
        no_episodes: "Brak odcinków w tym sezonie",
        pass_prompt: "Wpisz hasło konta lub administratora (112113):",
        wrong_pass: "Nieprawidłowe hasło!",
        fill_fields: "Wypełnij oba pola!",
        invalid_vk: "Nieprawidłowy link VK.",
        delete_movie_confirm: "Usunąć ten film?",
        fill_season_episodes: "Wypełnij numer sezonu i listę odcinków!",
        enter_series_name: "Wpisz tytuł nowego serialu!",
        episodes_added: "Wszystkie odcinki dodane!",
        delete_series_confirm: "Na pewno usunąć serial",
        delete_season_confirm: "Na pewno usunąć sezon",
        delete_episode_confirm: "Na pewno usunąć odcinek",
        season_word: "Sezon",
        episode_word: "Odcinek",
        acc_success: "Pomyślnie zalogowano na konto: ",
        acc_created: "Konto zostało pomyślnie utworzone i zalogowano: "
    },
    en: {
        logo: "🎥 My Media Library",
        nav_movies: "Movies",
        nav_series: "Series",
        nav_favorites: "⭐ Favorites",
        nav_add: "➕ Add",
        nav_contact: "✉️ Contact",
        nav_settings: "⚙️ Settings",
        nav_account: "👤 Account",
        movies_title: "Movie Catalog",
        search_movie_placeholder: "🔍 Find movie...",
        series_title: "Series Catalog",
        search_series_placeholder: "🔍 Find series...",
        select_series_prompt: "Select a series",
        delete_series_btn: "Delete series",
        delete_season_btn: "Delete season",
        delete_episode_btn: "Delete episode",
        seasons_label: "Seasons:",
        episodes_label: "Episodes:",
        select_episode_prompt: "Select an episode to play",
        fullscreen_btn: "⛶ Fullscreen",
        favorites_title: "Account Favorites",
        fav_movies_heading: "Favorite Movies",
        fav_series_heading: "Favorite Series",
        fav_btn_add: "⭐ Favorite",
        fav_btn_added: "⭐ Favorited",
        fav_login_required: "Log in to your account to add items to favorites!",
        remove_from_fav: "❌ Remove from favorites",
        add_title: "Content Management",
        add_movie_heading: "Add Movie",
        movie_title_label: "Movie Title:",
        movie_title_placeholder: "Example: Matrix",
        vk_link_label: "VK Video Link:",
        vk_link_placeholder: "Paste link https://vkvideo.ru/...",
        save_movie_btn: "Save Movie",
        add_episode_heading: "Add Episodes to Series",
        target_series_label: "Select series or create new:",
        create_new_series_option: "➕ Create new series...",
        new_series_title_label: "New Series Title:",
        new_series_placeholder: "Example: Breaking Bad",
        season_num_label: "Season Number (digits only, e.g. 1):",
        episodes_list_label: "Episodes list (format: Episode Number, Link):",
        add_episodes_btn: "Add Episodes",
        contact_title: "Contact Me",
        contact_heading: "Send me a message",
        contact_desc: "Fill out the form below and the message will be sent to email (via Formspree).",
        email_label: "Your Email:",
        message_label: "Message:",
        message_placeholder: "Text of your message...",
        send_btn: "Send Message",
        settings_title: "Settings",
        language_heading: "Language Choice",
        language_label: "Interface Language:",
        account_title: "Account Management",
        acc_name_label: "Account Name:",
        acc_pass_label: "Account Password:",
        acc_submit_btn: "Login / Register",
        acc_logout_btn: "Log Out",
        delete_btn: "Delete",
        nothing_found: "Nothing found",
        no_seasons: "No seasons",
        no_episodes: "No episodes in this season",
        pass_prompt: "Enter account or administrator password (112113):",
        wrong_pass: "Incorrect password!",
        fill_fields: "Fill in both fields!",
        invalid_vk: "Invalid VK link.",
        delete_movie_confirm: "Delete this movie?",
        fill_season_episodes: "Fill in the season number and episodes list!",
        enter_series_name: "Enter a name for the new series!",
        episodes_added: "All episodes added!",
        delete_series_confirm: "Are you sure you want to delete the series",
        delete_season_confirm: "Are you sure you want to delete the season",
        delete_episode_confirm: "Are you sure you want to delete the episode",
        season_word: "Season",
        episode_word: "Episode",
        acc_success: "Successfully logged in to account: ",
        acc_created: "Account successfully created and logged in: "
    }
};

function t(key) {
    if (translations[currentLang] && translations[currentLang][key]) {
        return translations[currentLang][key];
    }
    return translations['ru'][key] || key;
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('my_custom_lang', lang);
    updatePageTexts();
    initMovies(document.getElementById('movie-search').value);
    initSeries(document.getElementById('series-search').value);
    updateSeriesDropdown();
    updateAccountUI();
    initFavorites();
}

function updatePageTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerText = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    updateAccountUI();
}

let activeSeries = null;
let activeSeason = null;
let activeEpisodeIndex = null;

function switchSection(sectionId, event) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) targetSection.classList.add('active');
    if (event && event.target) event.target.classList.add('active');
    if (sectionId === 'add') updateSeriesDropdown();
    if (sectionId === 'account') updateAccountUI();
    if (sectionId === 'favorites') initFavorites();
}

function parseVkLink(inputVal) {
    if (inputVal.includes('<iframe')) return inputVal;
    let match = inputVal.match(/video(-?\d+_\d+)/);
    if (match) {
        let parts = match[1].split('_');
        return `<iframe src="https://vk.com/video_ext.php?oid=${parts[0]}&id=${parts[1]}&hd=2" width="100%" height="100%" allow="autoplay; encrypted-media; fullscreen; picture-in-picture;" frameborder="0" allowfullscreen></iframe>`;
    }
    return null;
}

function checkPassword() {
    const password = prompt(t('pass_prompt').replace(" (112113)", ""));
    if (password === null) return false;
    if (password === "112113") return true;
    if (currentAccount && password === currentAccount.password) return true;
    alert(t('wrong_pass'));
    return false;
}

// Работа с избранным
function getAccountFavorites() {
    if (!currentAccount) return { movies: [], series: [] };
    let allFavs = JSON.parse(localStorage.getItem('my_account_favorites')) || {};
    if (!allFavs[currentAccount.username]) {
        allFavs[currentAccount.username] = { movies: [], series: [] };
    }
    return allFavs[currentAccount.username];
}

function saveAccountFavorites(favs) {
    if (!currentAccount) return;
    let allFavs = JSON.parse(localStorage.getItem('my_account_favorites')) || {};
    allFavs[currentAccount.username] = favs;
    localStorage.setItem('my_account_favorites', JSON.stringify(allFavs));
}

function toggleFavoriteMovie(movieIndex) {
    if (!currentAccount) {
        alert(t('fav_login_required'));
        switchSection('account');
        return;
    }
    let favs = getAccountFavorites();
    const idx = favs.movies.indexOf(movieIndex);
    if (idx > -1) {
        favs.movies.splice(idx, 1);
    } else {
        favs.movies.push(movieIndex);
    }
    saveAccountFavorites(favs);
    initMovies(document.getElementById('movie-search').value);
    initFavorites();
}

function toggleFavoriteSeries() {
    if (!activeSeries) return;
    if (!currentAccount) {
        alert(t('fav_login_required'));
        switchSection('account');
        return;
    }
    if (!checkPassword()) return;

    let favs = getAccountFavorites();
    const idx = favs.series.indexOf(activeSeries.id);
    if (idx > -1) {
        favs.series.splice(idx, 1);
    } else {
        favs.series.push(activeSeries.id);
    }
    saveAccountFavorites(favs);
    updateSeriesFavoriteButton();
    initFavorites();
}

function removeSeriesFromFavorites(seriesId) {
    if (!currentAccount) return;
    if (!checkPassword()) return;

    let favs = getAccountFavorites();
    const idx = favs.series.indexOf(seriesId);
    if (idx > -1) {
        favs.series.splice(idx, 1);
        saveAccountFavorites(favs);
        updateSeriesFavoriteButton();
        initFavorites();
    }
}

function updateSeriesFavoriteButton() {
    const btn = document.getElementById('favorite-series-btn');
    if (!btn || !activeSeries) return;
    if (!currentAccount) {
        btn.style.display = 'none';
        return;
    }
    btn.style.display = 'inline-block';
    let favs = getAccountFavorites();
    if (favs.series.includes(activeSeries.id)) {
        btn.classList.add('active');
        btn.innerText = t('fav_btn_added');
    } else {
        btn.classList.remove('active');
        btn.innerText = t('fav_btn_add');
    }
}

function initFavorites() {
    const moviesGrid = document.getElementById('favorite-movies-grid');
    const seriesGrid = document.getElementById('favorite-series-grid');
    if (!moviesGrid || !seriesGrid) return;

    if (!currentAccount) {
        moviesGrid.innerHTML = `<p style="color: #7b7f85;">${t('fav_login_required')}</p>`;
        seriesGrid.innerHTML = `<p style="color: #7b7f85;">${t('fav_login_required')}</p>`;
        return;
    }

    let favs = getAccountFavorites();
    const favMovies = favs.movies.map(i => ({ movie: siteData.movies[i], index: i })).filter(item => item.movie !== undefined);
    
    if (favMovies.length === 0) {
        moviesGrid.innerHTML = `<p style="color: #7b7f85; grid-column: 1/-1;">${t('nothing_found')}</p>`;
    } else {
        moviesGrid.innerHTML = favMovies.map(({ movie, index }) => `
            <div class="card">
                <div class="video-box" id="fav-movie-player-${index}">${movie.vkEmbed}</div>
                <div class="card-info">
                    <h3>${movie.title}</h3>
                </div>
                <div class="card-actions">
                    <button class="btn-fullscreen" onclick="makeFullscreen('fav-movie-player-${index}')">${t('fullscreen_btn')}</button>
                    <button class="btn-delete" onclick="toggleFavoriteMovie(${index})">${t('remove_from_fav')}</button>
                </div>
            </div>
        `).join('');
    }

    const favSeriesList = siteData.series.filter(s => favs.series.includes(s.id));
    if (favSeriesList.length === 0) {
        seriesGrid.innerHTML = `<p style="color: #7b7f85; grid-column: 1/-1;">${t('nothing_found')}</p>`;
    } else {
        seriesGrid.innerHTML = favSeriesList.map(s => `
            <div class="card" style="padding: 15px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <h3 style="color: #fff; margin-bottom: 10px;">${s.title}</h3>
                    <p style="color: #a0a0a0; font-size: 13px;">Сезонов: ${Object.keys(s.seasons).length}</p>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button class="btn-save" style="flex: 1;" onclick="switchSection('series'); selectSeries(${s.id});">Смотреть</button>
                    <button class="btn-delete" style="flex: 1;" onclick="removeSeriesFromFavorites(${s.id})">Удалить</button>
                </div>
            </div>
        `).join('');
    }
}

// Аккаунты
function updateAccountUI() {
    const infoBlock = document.getElementById('current-account-info');
    const logoutBtn = document.getElementById('logout-btn');
    if (!infoBlock) return;

    if (currentAccount) {
        infoBlock.innerText = (currentLang === 'en' ? "Current Account: " : currentLang === 'pl' ? "Aktualne konto: " : currentLang === 'be' ? "Бягучы акаўнт: " : "Текущий аккаунт: ") + currentAccount.username;
        logoutBtn.style.display = 'block';
    } else {
        infoBlock.innerText = currentLang === 'en' ? "Status: Guest (no account)" : currentLang === 'pl' ? "Status: Gość (brak konta)" : currentLang === 'be' ? "Статус: Госць (без акаўнта)" : "Текущий статус: Гость (без входа)";
        logoutBtn.style.display = 'none';
    }
    updateSeriesFavoriteButton();
}

function loginOrRegisterAccount() {
    const usernameInput = document.getElementById('acc-username-input').value.trim();
    const passwordInput = document.getElementById('acc-password-input').value.trim();

    if (!usernameInput || !passwordInput) {
        alert(t('fill_fields'));
        return;
    }

    let accounts = JSON.parse(localStorage.getItem('my_saved_accounts')) || {};

    if (accounts[usernameInput]) {
        if (accounts[usernameInput] === passwordInput) {
            currentAccount = { username: usernameInput, password: passwordInput };
            localStorage.setItem('my_active_account', JSON.stringify(currentAccount));
            alert(t('acc_success') + usernameInput);
        } else {
            alert(t('wrong_pass'));
            return;
        }
    } else {
        accounts[usernameInput] = passwordInput;
        localStorage.setItem('my_saved_accounts', JSON.stringify(accounts));
        currentAccount = { username: usernameInput, password: passwordInput };
        localStorage.setItem('my_active_account', JSON.stringify(currentAccount));
        alert(t('acc_created') + usernameInput);
    }

    document.getElementById('acc-username-input').value = "";
    document.getElementById('acc-password-input').value = "";
    updateAccountUI();
    switchSection('movies');
    initMovies();
}

function logoutAccount() {
    currentAccount = null;
    localStorage.removeItem('my_active_account');
    updateAccountUI();
    alert("Вы вышли из аккаунта");
    initMovies();
    initFavorites();
}

// Рендер фильмов
function initMovies(filterText = "") {
    const grid = document.getElementById('movies-grid');
    if (!grid) return;

    const filtered = siteData.movies.map((movie, index) => ({ movie, index }))
        .filter(({ movie }) => movie.title.toLowerCase().includes(filterText.toLowerCase()));

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="color: #7b7f85; grid-column: 1/-1;">${t('nothing_found')}</p>`;
        return;
    }

    let favs = getAccountFavorites();

    grid.innerHTML = filtered.map(({ movie, index }) => {
        const isFav = favs.movies.includes(index);
        return `
            <div class="card">
                <div class="video-box" id="movie-player-${index}">${movie.vkEmbed}</div>
                <div class="card-info">
                    <h3>${movie.title}</h3>
                </div>
                <div class="card-actions">
                    <button class="btn-fullscreen" onclick="makeFullscreen('movie-player-${index}')">${t('fullscreen_btn')}</button>
                    <button class="btn-favorite ${isFav ? 'active' : ''}" onclick="toggleFavoriteMovie(${index})">${isFav ? t('fav_btn_added') : t('fav_btn_add')}</button>
                    <button class="btn-delete" onclick="deleteMovie(${index})">${t('delete_btn')}</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterMovies() {
    initMovies(document.getElementById('movie-search').value);
}

function makeFullscreen(elementId) {
    const elem = document.getElementById(elementId);
    if (!elem) return;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
}

async function deleteMovie(index) {
    if (!checkPassword()) return;
    if (confirm(t('delete_movie_confirm'))) {
        siteData.movies.splice(index, 1);
        await saveDataToCloud();
        initMovies();
    }
}

async function addNewMovie() {
    if (!checkPassword()) return;

    const title = document.getElementById('new-movie-title').value.trim();
    const rawLink = document.getElementById('new-movie-embed').value.trim();
    if (!title || !rawLink) { alert(t('fill_fields')); return; }
    let vkEmbed = parseVkLink(rawLink);
    if (!vkEmbed) { alert(t('invalid_vk')); return; }
    
    siteData.movies.push({ title, vkEmbed });
    await saveDataToCloud();

    document.getElementById('new-movie-title').value = "";
    document.getElementById('new-movie-embed').value = "";
    switchSection('movies');
    initMovies();
}

// Рендер сериалов
function initSeries(filterText = "") {
    const sidebar = document.getElementById('series-list');
    if (!sidebar) return;

    const filtered = siteData.series.filter(s => s.title.toLowerCase().includes(filterText.toLowerCase()));

    if (filtered.length === 0) {
        sidebar.innerHTML = `<p style="color: #7b7f85; padding: 10px;">${t('nothing_found')}</p>`;
        document.getElementById('selected-series-title').innerText = t('nothing_found');
        document.getElementById('delete-series-btn').style.display = 'none';
        document.getElementById('favorite-series-btn').style.display = 'none';

        let extraSeasonDel = document.getElementById('delete-season-btn');
        if (extraSeasonDel) extraSeasonDel.remove();

        let extraEpDel = document.getElementById('delete-episode-btn');
        if (extraEpDel) extraEpDel.remove();

        document.getElementById('seasons-block').style.display = 'none';
        document.getElementById('episodes-block').style.display = 'none';
        document.getElementById('vk-player-container').innerHTML = `<p class="placeholder-text">${t('no_episodes')}</p>`;
        return;
    }

    sidebar.innerHTML = filtered.map(s => `
        <div class="series-item" onclick="selectSeries(${s.id})" id="ser-${s.id}">${s.title}</div>
    `).join('');

    if (!activeSeries || !filtered.some(s => s.id === activeSeries.id)) {
        selectSeries(filtered[0].id);
    } else {
        selectSeries(activeSeries.id);
    }
}

function filterSeries() {
    initSeries(document.getElementById('series-search').value);
}

function selectSeries(id) {
    activeSeries = siteData.series.find(s => s.id === id);
    if (!activeSeries) return;

    document.querySelectorAll('.series-item').forEach(el => el.classList.remove('active'));
    const activeItem = document.getElementById(`ser-${id}`);
    if (activeItem) activeItem.classList.add('active');

    document.getElementById('selected-series-title').innerText = activeSeries.title;
    document.getElementById('delete-series-btn').style.display = 'block';
    updateSeriesFavoriteButton();

    const seasons = Object.keys(activeSeries.seasons);
    const seasonsBlock = document.getElementById('seasons-block');
    const seasonsContainer = document.getElementById('seasons-buttons-container');
    const episodesBlock = document.getElementById('episodes-block');

    let seasonDelBtn = document.getElementById('delete-season-btn');
    if (!seasonDelBtn) {
        seasonDelBtn = document.createElement('button');
        seasonDelBtn.id = 'delete-season-btn';
        seasonDelBtn.className = 'btn-delete';
        seasonDelBtn.style.marginLeft = '10px';
        seasonDelBtn.style.fontSize = '12px';
        seasonDelBtn.style.padding = '5px 10px';
        seasonDelBtn.onclick = deleteCurrentSeason;
        seasonsBlock.querySelector('.selection-label').after(seasonDelBtn);
    }
    seasonDelBtn.innerText = t('delete_season_btn');

    if (seasons.length === 0) {
        seasonsBlock.style.display = 'none';
        episodesBlock.style.display = 'none';
        seasonDelBtn.style.display = 'none';
        return;
    }

    seasonsBlock.style.display = 'block';
    seasonDelBtn.style.display = 'inline-block';

    seasonsContainer.innerHTML = seasons.map(seas => {
        let displaySeasonName = isNaN(seas) ? seas : `${t('season_word')} ${seas}`;
        return `<button class="choice-btn season-btn" onclick="selectSeason('${seas}')" id="seas-${seas}">${displaySeasonName}</button>`;
    }).join('');

    selectSeason(seasons[0]);
}

function selectSeason(seasonNum) {
    activeSeason = seasonNum;

    document.querySelectorAll('.season-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`seas-${seasonNum}`);
    if (activeBtn) activeBtn.classList.add('active');

    const episodes = activeSeries.seasons[seasonNum] || [];
    const episodesBlock = document.getElementById('episodes-block');
    const episodesContainer = document.getElementById('episodes-buttons-container');

    let episodeDelBtn = document.getElementById('delete-episode-btn');
    if (!episodeDelBtn) {
        episodeDelBtn = document.createElement('button');
        episodeDelBtn.id = 'delete-episode-btn';
        episodeDelBtn.className = 'btn-delete';
        episodeDelBtn.style.marginLeft = '10px';
        episodeDelBtn.style.fontSize = '12px';
        episodeDelBtn.style.padding = '5px 10px';
        episodeDelBtn.onclick = deleteCurrentEpisode;
        episodesBlock.querySelector('.selection-label').after(episodeDelBtn);
    }
    episodeDelBtn.innerText = t('delete_episode_btn');

    if (episodes.length === 0) {
        episodesBlock.style.display = 'none';
        episodeDelBtn.style.display = 'none';
        return;
    }

    episodesBlock.style.display = 'block';
    episodeDelBtn.style.display = 'inline-block';

    episodesContainer.innerHTML = episodes.map((ep, idx) => {
        let displayEpName = isNaN(ep.number) ? ep.number : `${t('episode_word')} ${ep.number}`;
        return `<button class="choice-btn episode-btn" onclick="playVkEpisode(${idx})" id="ep-${idx}">${displayEpName}</button>`;
    }).join('');

    playVkEpisode(0);
}

function playVkEpisode(epIndex) {
    activeEpisodeIndex = epIndex;
    document.querySelectorAll('.episode-btn').forEach(btn => btn.classList.remove('active'));
    const activeEpBtn = document.getElementById(`ep-${epIndex}`);
    if (activeEpBtn) activeEpBtn.classList.add('active');

    const playerContainer = document.getElementById('vk-player-container');
    if (!playerContainer || !activeSeason || activeSeries.seasons[activeSeason] === undefined) return;

    const episode = activeSeries.seasons[activeSeason][epIndex];
    if (episode) {
        playerContainer.innerHTML = episode.vkEmbed;
    }
}

function updateSeriesDropdown() {
    const select = document.getElementById('target-series-select');
    if (!select) return;
    select.innerHTML = `<option value="new">${t('create_new_series_option')}</option>` + siteData.series.map(s => `<option value="${s.id}">${s.title}</option>`).join('');
    checkNewSeriesInput();
}

function checkNewSeriesInput() {
    const val = document.getElementById('target-series-select').value;
    const group = document.getElementById('new-series-name-group');
    if (group) group.style.display = (val === 'new') ? 'flex' : 'none';
}

async function addNewEpisode() {
    if (!checkPassword()) return;

    const targetVal = document.getElementById('target-series-select').value;
    let seasonInput = document.getElementById('new-season-title').value.trim();
    const bulkText = document.getElementById('bulk-episodes').value.trim();

    if (!seasonInput || !bulkText) { alert(t('fill_season_episodes')); return; }

    let targetSeries;
    if (targetVal === 'new') {
        const newTitle = document.getElementById('new-series-title').value.trim();
        if (!newTitle) { alert(t('enter_series_name')); return; }
        targetSeries = { id: Date.now(), title: newTitle, seasons: {} };
        siteData.series.push(targetSeries);
    } else {
        targetSeries = siteData.series.find(s => s.id == targetVal);
    }

    if (!targetSeries.seasons[seasonInput]) targetSeries.seasons[seasonInput] = [];

    const lines = bulkText.split('\n');
    lines.forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 2) {
            let epNum = parts[0].trim();
            let rawLink = parts[1].trim();
            const vkEmbed = parseVkLink(rawLink);
            if (vkEmbed) targetSeries.seasons[seasonInput].push({ number: epNum, vkEmbed });
        }
    });

    await saveDataToCloud();

    document.getElementById('new-season-title').value = "";
    document.getElementById('bulk-episodes').value = "";
    if (targetVal === 'new') document.getElementById('new-series-title').value = "";
    
    initSeries();
    switchSection('series');
    alert(t('episodes_added'));
}

async function deleteCurrentSeries() {
    if (!activeSeries) return;
    if (!checkPassword()) return;
    if (confirm(`${t('delete_series_confirm')} "${activeSeries.title}"?`)) {
        siteData.series = siteData.series.filter(s => s.id !== activeSeries.id);
        await saveDataToCloud();
        activeSeries = null;
        initSeries();
    }
}

async function deleteCurrentSeason() {
    if (!activeSeries || !activeSeason) return;
    if (!checkPassword()) return;

    let seasonDisplayLabel = isNaN(activeSeason) ? activeSeason : `${t('season_word')} ${activeSeason}`;
    if (confirm(`${t('delete_season_confirm')} "${seasonDisplayLabel}"?`)) {
        delete activeSeries.seasons[activeSeason];
        await saveDataToCloud();
        initSeries(document.getElementById('series-search').value);
    }
}

async function deleteCurrentEpisode() {
    if (!activeSeries || !activeSeason || activeEpisodeIndex === null) return;
    if (!checkPassword()) return;

    let episodes = activeSeries.seasons[activeSeason];
    if (!episodes || !episodes[activeEpisodeIndex]) return;

    let epObj = episodes[activeEpisodeIndex];
    let epDisplayLabel = isNaN(epObj.number) ? epObj.number : `${t('episode_word')} ${epObj.number}`;

    if (confirm(`${t('delete_episode_confirm')} "${epDisplayLabel}"?`)) {
        episodes.splice(activeEpisodeIndex, 1);
        if (episodes.length === 0) {
            delete activeSeries.seasons[activeSeason];
        }
        await saveDataToCloud();
        initSeries(document.getElementById('series-search').value);
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById('language-select');
    if (langSelect) langSelect.value = currentLang;
    
    updatePageTexts();
    loadDataFromCloud(); // Загружаем данные из облака при старте
    updateAccountUI();
});
