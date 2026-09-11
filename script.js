// ============================================
// VARIABLES GLOBALES
// ============================================
let allData = [];
let currentCategory = 'todos';
let currentPage = 1;
const itemsPerPage = 12;

// Elementos del DOM
const cardsGrid = document.getElementById('cardsGrid');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const resultsCount = document.getElementById('resultsCount');
const categoryLabel = document.getElementById('categoryLabel');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.querySelector('.sidebar');
const scrollTopBtn = document.getElementById('scrollTopBtn');

// Mapeo de categorías para mostrar en español
// ¡AHORA INCLUYE TODAS LAS CATEGORÍAS DEL JSON!
const categoryNames = {
    'todos': 'Todos los alojamientos',
    'hotel': 'Hoteles',
    'aparthotel': 'Aparthoteles',
    'posada': 'Posadas',
    'residencial': 'Residenciales',
    'hostería': 'Hosterías',
    'hospedaje': 'Hospedajes',
    'hostel': 'Hosteles',
    'departamento': 'Departamentos',
    'cabaña': 'Cabañas',
    'apart cabaña': 'Apart Cabañas',
    'complejo de cabañas': 'Complejos de Cabañas',
    'colonia': 'Colonias',
    'camping': 'Campings',
    'casa de alquiler': 'Casas de Alquiler',
    'agencias de viajes': 'Agencias de Viajes',
    'otros': 'Otros alojamientos'
};

// Íconos por categoría
const categoryIcons = {
    'hotel': 'fa-hotel',
    'aparthotel': 'fa-building',
    'posada': 'fa-bed',
    'residencial': 'fa-house-chimney',
    'hostería': 'fa-utensils',
    'hospedaje': 'fa-bed',
    'hostel': 'fa-people-group',
    'departamento': 'fa-building',
    'cabaña': 'fa-tree',
    'apart cabaña': 'fa-tree',
    'complejo de cabañas': 'fa-tree',
    'colonia': 'fa-umbrella-beach',
    'camping': 'fa-campground',
    'casa de alquiler': 'fa-house',
    'agencias de viajes': 'fa-suitcase',
    'otros': 'fa-hotel'
};

// Colores por categoría
const categoryColors = {
    'hotel': '#00adb7',
    'aparthotel': '#00adb7',
    'posada': '#ff7300',
    'residencial': '#ff7300',
    'hostería': '#ff7300',
    'hospedaje': '#ff7300',
    'hostel': '#ff7300',
    'departamento': '#ff9b00',
    'cabaña': '#7cc100',
    'apart cabaña': '#7cc100',
    'complejo de cabañas': '#7cc100',
    'colonia': '#b4d006',
    'camping': '#b4d006',
    'casa de alquiler': '#4a6fa5',
    'agencias de viajes': '#4a6fa5',
    'otros': '#4a6fa5'
};

// ============================================
// FUNCIÓN PARA CARGAR LOS DATOS
// ============================================
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Error al cargar los datos');
        allData = await response.json();
        render();
    } catch (error) {
        console.error('Error:', error);
        cardsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error al cargar los datos</h3>
                <p>Por favor, intentá nuevamente más tarde.</p>
            </div>
        `;
        resultsCount.textContent = 'Error';
    }
}

// ============================================
// FUNCIONES DE FILTRADO - ¡CORREGIDAS!
// ============================================
// Normaliza un texto a minúsculas y sin tildes (para buscar "rio" -> "ríos")
function normalize(str) {
    return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function getFilteredData() {
    const searchTerm = normalize(searchInput.value);
    
    // Siempre trabajamos sobre TODOS los datos
    let filtered = allData;
    
    // Filtrar por categoría
    if (currentCategory !== 'todos') {
        // Categorías agrupadas bajo la pestaña "Otros"
        const otherCategories = ['hostería', 'hospedaje', 'hostel', 'colonia', 'residencial', 'complejo de cabañas'];
        const otherNormalized = otherCategories.map(normalize);
        filtered = filtered.filter(item => {
            // Normalizamos la categoría para comparar (tolerante a tildes)
            const itemCategory = normalize(item.categoria);
            const targetCategory = normalize(currentCategory);
            if (targetCategory === 'otros') {
                return otherNormalized.includes(itemCategory);
            }
            return itemCategory === targetCategory;
        });
    }
    
    // Filtrar por búsqueda (sobre TODOS los datos filtrados por categoría)
    if (searchTerm) {
        filtered = filtered.filter(item => {
            const searchText = normalize(`${item.nombre} ${item.direccion} ${item.telefono} ${item.web || ''}`);
            return searchText.includes(searchTerm);
        });
    }
    
    return filtered;
}

// ============================================
// FUNCIONES DE PAGINACIÓN
// ============================================
function getPaginatedData(filteredData) {
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Asegurar que la página actual sea válida
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
    if (totalPages === 0) currentPage = 1;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = filteredData.slice(start, end);
    
    return {
        items: paginatedItems,
        totalItems,
        totalPages,
        currentPage
    };
}

// ============================================
// LINKS DE TELÉFONO
// ============================================
function getPhoneLinks(item) {
    const links = { telHref: null, waHref: null };

    // Registros normalizados: usar el array "telefonos"
    if (Array.isArray(item.telefonos) && item.telefonos.length > 0) {
        const fijo = item.telefonos.find(t => t.tipo === 'fijo' && t.e164);
        const cel = item.telefonos.find(t => t.tipo === 'celular' && t.e164);
        if (fijo) links.telHref = `tel:${fijo.e164}`;
        else if (cel) links.telHref = `tel:${cel.e164}`;
        if (cel && cel.whatsapp) {
            links.waHref = `https://wa.me/${cel.whatsapp}?text=${encodeURIComponent(getWhatsAppMessage(item))}`;
        }
        return links;
    }

    // Fallback para registros que todavía no tienen el array normalizado
    if (item.telefono) {
        const telClean = item.telefono.replace(/\s/g, '').replace(/[()\-]/g, '');
        links.telHref = `tel:+${telClean}`;
        let whatsappNumber = telClean;
        if (whatsappNumber.startsWith('0')) {
            whatsappNumber = '54' + whatsappNumber.substring(1);
        } else if (!whatsappNumber.startsWith('54')) {
            whatsappNumber = '54' + whatsappNumber;
        }
        links.waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(getWhatsAppMessage(item))}`;
    }

    return links;
}

// Etiqueta de la categoría para usar en el mensaje de WhatsApp
const categoryMsgNames = {
    'hotel': 'Hotel',
    'aparthotel': 'Aparthotel',
    'posada': 'Posada',
    'residencial': 'Residencial',
    'hostería': 'Hostería',
    'hospedaje': 'Hospedaje',
    'hostel': 'Hostel',
    'departamento': 'Departamento',
    'cabaña': 'Cabañas',
    'apart cabaña': 'Apart Cabañas',
    'complejo de cabañas': 'Complejo de Cabañas',
    'colonia': 'Colonia',
    'camping': 'Camping',
    'casa de alquiler': 'Casa de Alquiler',
    'agencias de viajes': 'Agencia de Viajes'
};

function getWhatsAppMessage(item) {
    const categoria = categoryMsgNames[item.categoria] || item.categoria;
    return `Hola, lo contacto desde la Guía de Alojamientos de Santa Rosa de Calamuchita para consultar disponibilidad en ${categoria} ${item.nombre}.`;
}

// ============================================
// FUNCIÓN PARA GENERAR TARJETAS
// ============================================
function createCard(item) {
    const icon = categoryIcons[item.categoria] || 'fa-home';
    const categoryColor = categoryColors[item.categoria] || '#00adb7';
    const catName = categoryNames[item.categoria] || item.categoria;
    const phoneLinks = getPhoneLinks(item);
    
    let html = `
        <div class="card">
            <span class="card-category" style="background:${categoryColor}20; color:${categoryColor}">
                <i class="fas ${icon}"></i> ${catName}
            </span>
            <h3>${item.nombre}</h3>
            <div class="card-details">
    `;
    
    if (item.direccion) {
        html += `
            <div class="detail">
                <i class="fas fa-map-pin"></i>
                <span class="address-text">${item.direccion}</span>
            </div>
        `;
    }
    
    if (item.telefono && phoneLinks.telHref) {
        html += `
            <div class="detail">
                <i class="fas fa-phone"></i>
                <a href="${phoneLinks.telHref}" style="color: var(--color-text-light); text-decoration: none;">
                    ${item.telefono}
                </a>
            </div>
        `;
    }
    
    html += `</div><div class="card-actions">`;
    
    if (item.web) {
        html += `
            <a href="${item.web}" target="_blank" rel="noopener noreferrer" class="btn-card primary">
                <i class="fas fa-globe"></i> Ver sitio
            </a>
        `;
    }
    
    if (phoneLinks.telHref) {
        html += `
            <a href="${phoneLinks.telHref}" class="btn-card outline">
                <i class="fas fa-phone"></i> Llamar
            </a>
        `;
    }
    
    if (phoneLinks.waHref) {
        html += `
            <a href="${phoneLinks.waHref}" target="_blank" rel="noopener noreferrer" class="btn-card whatsapp">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </a>
        `;
    }
    
    html += `</div></div>`;
    return html;
}

// ============================================
// FUNCIÓN PRINCIPAL DE RENDERIZADO
// ============================================
function render() {
    // Obtener TODOS los datos filtrados (NO solo los paginados)
    const filteredData = getFilteredData();
    const { items, totalItems, totalPages, currentPage: page } = getPaginatedData(filteredData);
    
    // Actualizar contador
    resultsCount.textContent = `${totalItems} establecimientos encontrados`;
    
    // Actualizar etiqueta de categoría
    const searchTerm = searchInput.value.trim();
    let label = categoryNames[currentCategory] || 'Todos los alojamientos';
    if (searchTerm) {
        label += ` (búsqueda: "${searchTerm}")`;
    }
    categoryLabel.textContent = label;
    
    // Generar tarjetas
    if (items.length === 0) {
        cardsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No se encontraron resultados</h3>
                <p>Probá con otra categoría o término de búsqueda.</p>
            </div>
        `;
    } else {
        cardsGrid.innerHTML = items.map(item => createCard(item)).join('');
    }
    
    // Generar paginación
    renderPagination(totalPages, page);
}

// ============================================
// FUNCIÓN DE PAGINACIÓN
// ============================================
function renderPagination(totalPages, currentPage) {
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    html += `
        <button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    if (startPage > 1) {
        html += `<button onclick="goToPage(1)">1</button>`;
        if (startPage > 2) html += `<span class="page-info">...</span>`;
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button onclick="goToPage(${i})" class="${i === currentPage ? 'active' : ''}">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) html += `<span class="page-info">...</span>`;
        html += `<button onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    html += `
        <button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = html;
}

// ============================================
// FUNCIONES DE NAVEGACIÓN
// ============================================
function goToPage(page) {
    const filteredData = getFilteredData();
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    currentPage = page;
    render();
    
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function changeCategory(category) {
    if (category === currentCategory) return;
    
    currentCategory = category;
    currentPage = 1;
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.categoria === category) {
            link.classList.add('active');
        }
    });
    
    navMenu.classList.remove('open');
    render();
}

// ============================================
// EVENT LISTENERS
// ============================================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.dataset.categoria;
        changeCategory(category);
    });
});

searchInput.addEventListener('input', () => {
    searchClear.classList.toggle('visible', searchInput.value.length > 0);
    currentPage = 1;
    render();
});

searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.classList.remove('visible');
    currentPage = 1;
    render();
    searchInput.focus();
});

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

// ============================================
// INICIALIZAR
// ============================================
document.addEventListener('DOMContentLoaded', loadData);