// Cargar valores guardados desde localStorage
window.addEventListener('load', () => {
    document.getElementById('keywords').value = localStorage.getItem('keywords') || '';
    document.getElementById('country').value = localStorage.getItem('country') || '';
    document.getElementById('timeFilter').value = localStorage.getItem('timeFilter') || '';
    document.getElementById('experienceLevel').value = localStorage.getItem('experienceLevel') || '';
    document.getElementById('easyApply').checked = localStorage.getItem('easyApply') === 'true';
    document.getElementById('lessThanTen').checked = localStorage.getItem('lessThanTen') === 'true';
    loadSavedSearches();
});

// Función para cargar búsquedas guardadas en el dropdown
function loadSavedSearches() {
    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    const select = document.getElementById('savedSearches');
    select.innerHTML = '<option value="">SELECCIONA UNA BÚSQUEDA</option>';
    savedSearches.forEach((search, index) => {
        const option = document.createElement('option');
        option.value = index;
        const countryLabel = getCountryLabel(search.country);
        const filters = [];
        if (search.easyApply) filters.push('SOLICITUD SENCILLA');
        if (search.lessThanTen) filters.push('MENOS DE 10 CANDIDATOS');
        const filterText = filters.length ? ` [${filters.join(', ')}]` : '';
        option.text = `${search.keywords || 'SIN PALABRAS CLAVE'} ${countryLabel ? `(${countryLabel})` : ''} ${search.timeFilter ? `(${getTimeFilterLabel(search.timeFilter)})` : ''}${filterText}`;
        select.appendChild(option);
    });
}

// Función para obtener etiqueta legible del filtro de país
function getCountryLabel(geoId) {
    const countryMap = {
        '100446943': 'ARGENTINA',
        '103644278': 'ESTADOS UNIDOS',
        '91000000': 'UNIÓN EUROPEA',
        '91000011': 'LATINOAMÉRICA',
        '92000000': 'TODO EL MUNDO'
    };
    return countryMap[geoId] || '';
}

// Función para obtener etiqueta legible del filtro de tiempo
function getTimeFilterLabel(timeFilter) {
    const timeMap = {
        'r3600': 'ÚLTIMA HORA',
        'r7200': 'ÚLTIMAS 2 HORAS',
        'r10800': 'ÚLTIMAS 3 HORAS',
        'r14400': 'ÚLTIMAS 4 HORAS',
        'r18000': 'ÚLTIMAS 5 HORAS',
        'r21600': 'ÚLTIMAS 6 HORAS',
        'r25200': 'ÚLTIMAS 7 HORAS',
        'r28800': 'ÚLTIMAS 8 HORAS',
        'r32400': 'ÚLTIMAS 9 HORAS',
        'r36000': 'ÚLTIMAS 10 HORAS',
        'r39600': 'ÚLTIMAS 11 HORAS',
        'r43200': 'ÚLTIMAS 12 HORAS'
    };
    return timeMap[timeFilter] || 'CUALQUIER MOMENTO';
}

// Función para guardar el estado actual del formulario
function saveFormState() {
    const formState = {
        keywords: document.getElementById('keywords').value,
        country: document.getElementById('country').value,
        timeFilter: document.getElementById('timeFilter').value,
        experienceLevel: document.getElementById('experienceLevel').value,
        easyApply: document.getElementById('easyApply').checked,
        lessThanTen: document.getElementById('lessThanTen').checked
    };

    Object.entries(formState).forEach(([key, value]) => {
        localStorage.setItem(key, typeof value === 'boolean' ? value : (value || ''));
    });
}

// Función para cargar el estado guardado del formulario
function loadFormState() {
    document.getElementById('keywords').value = localStorage.getItem('keywords') || '';
    document.getElementById('country').value = localStorage.getItem('country') || '';
    document.getElementById('timeFilter').value = localStorage.getItem('timeFilter') || '';
    document.getElementById('experienceLevel').value = localStorage.getItem('experienceLevel') || '';
    document.getElementById('easyApply').checked = localStorage.getItem('easyApply') === 'true';
    document.getElementById('lessThanTen').checked = localStorage.getItem('lessThanTen') === 'true';
}

// Guardar búsqueda
document.getElementById('saveSearch').addEventListener('click', () => {
    const formData = {
        keywords: document.getElementById('keywords').value.trim(),
        country: document.getElementById('country').value,
        timeFilter: document.getElementById('timeFilter').value,
        experienceLevel: document.getElementById('experienceLevel').value,
        easyApply: document.getElementById('easyApply').checked,
        lessThanTen: document.getElementById('lessThanTen').checked
    };

    if (!formData.keywords) {
        const errorAlert = document.getElementById('errorAlert');
        errorAlert.textContent = 'POR FAVOR, INGRESA PALABRAS CLAVE PARA GUARDAR LA BÚSQUEDA';
        errorAlert.style.display = 'block';
        setTimeout(() => { errorAlert.style.display = 'none'; }, 3000);
        return;
    }

    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    savedSearches.push(formData);
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches));

    const successAlert = document.getElementById('successAlert');
    successAlert.textContent = 'BÚSQUEDA GUARDADA CORRECTAMENTE';
    successAlert.style.display = 'block';
    setTimeout(() => { successAlert.style.display = 'none'; }, 3000);

    loadSavedSearches();
});

// Cargar búsqueda
document.getElementById('loadSearch').addEventListener('click', () => {
    const select = document.getElementById('savedSearches');
    const index = select.value;
    if (index === '') return;

    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    const search = savedSearches[index];

    document.getElementById('keywords').value = search.keywords || '';
    document.getElementById('country').value = search.country || '';
    document.getElementById('timeFilter').value = search.timeFilter || '';
    document.getElementById('experienceLevel').value = search.experienceLevel || '';
    document.getElementById('easyApply').checked = Boolean(search.easyApply);
    document.getElementById('lessThanTen').checked = Boolean(search.lessThanTen);

    // Guardar en localStorage
    localStorage.setItem('keywords', search.keywords || '');
    localStorage.setItem('country', search.country || '');
    localStorage.setItem('timeFilter', search.timeFilter || '');
    localStorage.setItem('experienceLevel', search.experienceLevel || '');
    localStorage.setItem('easyApply', search.easyApply || false);
    localStorage.setItem('lessThanTen', search.lessThanTen || false);

    // Scroll suave al top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    const successAlert = document.getElementById('successAlert');
    successAlert.textContent = 'BÚSQUEDA CARGADA CORRECTAMENTE';
    successAlert.style.display = 'block';
    setTimeout(() => { successAlert.style.display = 'none'; }, 3000);
});

// Crear el diálogo de confirmación
function createConfirmDialog() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    
    dialog.innerHTML = `
        <p>¿ESTÁS SEGURO DE QUE QUIERES ELIMINAR ESTA BÚSQUEDA?</p>
        <div class="buttons">
            <button class="btn btn-sm" id="confirmDelete">ELIMINAR</button>
            <button class="btn btn-sm" id="cancelDelete">CANCELAR</button>
        </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    return { overlay, dialog };
}

// Eliminar búsqueda
document.getElementById('deleteSearch').addEventListener('click', () => {
    const select = document.getElementById('savedSearches');
    const index = select.value;
    if (index === '') return;

    const { overlay, dialog } = createConfirmDialog();
    
    document.getElementById('confirmDelete').addEventListener('click', () => {
        const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
        savedSearches.splice(index, 1);
        localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
        loadSavedSearches();
        
        // Mostrar mensaje de éxito
        const successAlert = document.getElementById('successAlert');
        successAlert.textContent = 'BÚSQUEDA ELIMINADA CORRECTAMENTE';
        successAlert.style.display = 'block';
        setTimeout(() => { successAlert.style.display = 'none'; }, 3000);
        
        overlay.remove();
    });
    
    document.getElementById('cancelDelete').addEventListener('click', () => {
        overlay.remove();
    });
});

// Enviar formulario
document.getElementById('jobSearchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Mostrar la ruleta
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'inline-block';

    const keywords = document.querySelector('#keywords').value.trim();
    const country = document.getElementById('country').value;
    const timeFilter = document.getElementById('timeFilter').value;
    const experienceLevel = document.querySelector('#experienceLevel').value;
    const easyApply = document.getElementById('easyApply').checked;
    const lessThanTen = document.getElementById('lessThanTen').checked;
    const errorAlert = document.getElementById('errorAlert');

    // Validación
    if (!keywords) {
        errorAlert.textContent = 'POR FAVOR, INGRESA PALABRAS CLAVE';
        errorAlert.style.display = 'block';
        spinner.style.display = 'none';
        setTimeout(() => { errorAlert.style.display = 'none'; }, 3000);
        return;
    }

    // Guardar filtros en localStorage
    localStorage.setItem('keywords', keywords);
    localStorage.setItem('country', country);
    localStorage.setItem('timeFilter', timeFilter);
    localStorage.setItem('experienceLevel', experienceLevel);
    localStorage.setItem('easyApply', easyApply);
    localStorage.setItem('lessThanTen', lessThanTen);

    // Construir URL de LinkedIn
    let url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&f_WT=2&sortBy=DD`;
    if (country) url += `&geoId=${encodeURIComponent(country)}`;
    if (timeFilter) url += `&f_TPR=${timeFilter}`;
    if (experienceLevel) url += `&f_E=${experienceLevel}`;
    if (easyApply) url += `&f_AL=true`;
    if (lessThanTen) url += `&f_EA=true`;

    // Abrir en una nueva pestaña después de un breve retraso para mostrar el spinner
    setTimeout(() => {
        window.open(url, '_blank');
        spinner.style.display = 'none';
    }, 500);
});

// Configuración de tema
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(isDark) {
    document.documentElement.classList.toggle('dark-theme', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Inicializar tema
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme === 'dark');
} else {
    setTheme(prefersDarkScheme.matches);
}

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Configuración de idiomas
const translations = {
    es: {
        title: 'BUSCADOR DE EMPLEOS',
        keywords: 'PALABRAS CLAVE',
        location: 'LOCALIZACIÓN',
        timePosted: 'PUBLICADO EN',
        experienceLevel: 'NIVEL DE EXPERIENCIA',
        easyApply: 'SOLICITUD SENCILLA',
        search: 'BUSCAR',
        saveSearch: 'GUARDAR BÚSQUEDA',
        savedSearches: 'BÚSQUEDAS GUARDADAS',
        load: 'CARGAR',
        delete: 'ELIMINAR'
    },
    en: {
        title: 'JOB SEARCH',
        keywords: 'KEYWORDS',
        location: 'LOCATION',
        timePosted: 'TIME POSTED',
        experienceLevel: 'EXPERIENCE LEVEL',
        easyApply: 'EASY APPLY',
        search: 'SEARCH',
        saveSearch: 'SAVE SEARCH',
        savedSearches: 'SAVED SEARCHES',
        load: 'LOAD',
        delete: 'DELETE'
    },
    pt: {
        title: 'BUSCA DE EMPREGOS',
        keywords: 'PALAVRAS-CHAVE',
        location: 'LOCALIZAÇÃO',
        timePosted: 'PUBLICADO EM',
        experienceLevel: 'NÍVEL DE EXPERIÊNCIA',
        easyApply: 'CANDIDATURA SIMPLIFICADA',
        search: 'BUSCAR',
        saveSearch: 'SALVAR BUSCA',
        savedSearches: 'BUSCAS SALVAS',
        load: 'CARREGAR',
        delete: 'EXCLUIR'
    }
};

function updateLanguage(lang) {
    const elements = {
        title: document.querySelector('h1'),
        keywords: document.querySelector('label[for="keywords"]'),
        location: document.querySelector('label[for="country"]'),
        timePosted: document.querySelector('label[for="timeFilter"]'),
        experienceLevel: document.querySelector('label[for="experienceLevel"]'),
        easyApply: document.querySelector('label[for="easyApply"]'),
        search: document.querySelector('.btn-primary'),
        saveSearch: document.getElementById('saveSearch'),
        savedSearches: document.querySelector('.saved-searches h3'),
        load: document.getElementById('loadSearch'),
        delete: document.getElementById('deleteSearch')
    };

    const texts = translations[lang];
    for (const [key, element] of Object.entries(elements)) {
        if (element && texts[key]) {
            element.textContent = texts[key];
        }
    }

    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
}

// Inicializar idioma
const languageSelect = document.getElementById('languageSelect');
const savedLanguage = localStorage.getItem('language') || 'es';
languageSelect.value = savedLanguage;
updateLanguage(savedLanguage);

languageSelect.addEventListener('change', (e) => {
    updateLanguage(e.target.value);
}); 