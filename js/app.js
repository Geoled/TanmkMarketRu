// --- API INTEGRATION ---
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api';

// Функция для загрузки данных с бэкенда
async function fetchListingsFromAPI() {
    try {
        const params = new URLSearchParams();
        if (state.category !== 'all') params.append('category', state.category);
        if (state.search) params.append('search', state.search);
        if (state.maxPrice) params.append('maxPrice', state.maxPrice.toString());
        if (state.has3D) params.append('has3D', 'true');
        if (state.hasBlueprint) params.append('hasBlueprint', 'true');
        if (state.sortBy) params.append('sort', state.sortBy);

        const response = await fetch(`${API_BASE_URL}/listings?${params.toString()}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Ошибка при загрузке данных с бэкенда:', error);
        // Fallback на локальные данные если бэкенд недоступен
        console.log('Используем локальные данные как fallback');
        return listingsData;
    }
}

// --- STATE MANAGEMENT ---
const state = {
    search: '',
    category: 'all',
    maxPrice: null,
    has3D: false,
    hasBlueprint: false,
    sortBy: 'newest'
};

let comparisonList = [];
let activeMap = null;

// --- UTILS ---
const formatPrice = (price) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);

// --- CORE FILTER & RENDER LOGIC ---
async function applyFilters() {
    // 1. Считываем состояние из DOM
    state.search = document.getElementById('mainSearch').value.toLowerCase();
    state.maxPrice = document.getElementById('filterPrice').checked ? 10000000 : null;
    state.has3D = document.getElementById('filter3D').checked;
    state.hasBlueprint = document.getElementById('filterBlueprint').checked;
    state.sortBy = document.getElementById('sortSelect').value;

    // 2. Пытаемся загрузить данные с бэкенда API
    let filtered = await fetchListingsFromAPI();
    
    // Если данные пришли пустые или произошла ошибка, используем локальные данные
    if (filtered.length === 0 && listingsData && listingsData.length > 0) {
        // Применяем фильтрацию на локальных данных
        filtered = listingsData.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(state.search) || 
                                  item.categoryLabel.toLowerCase().includes(state.search) ||
                                  item.description.toLowerCase().includes(state.search);
            const matchesCategory = state.category === 'all' ? true :
                                    state.category === 'demilitarized' ? (item.status === 'demilitarized' || item.status === 'museum') :
                                    item.category === state.category;
            const matchesPrice = state.maxPrice ? item.price <= state.maxPrice : true;
            const matches3D = state.has3D ? item.has3D : true;
            const matchesBlueprint = state.hasBlueprint ? item.hasBlueprint : true;

            return matchesSearch && matchesCategory && matchesPrice && matches3D && matchesBlueprint;
        });
    }

    // 3. Сортировка
    filtered.sort((a, b) => {
        if (state.sortBy === 'price_asc') return a.price - b.price;
        if (state.sortBy === 'price_desc') return b.price - a.price;
        if (state.sortBy === 'weight') return b.combatWeight - a.combatWeight;
        return b.id - a.id; // newest by default (higher ID)
    });

    renderListings(filtered);
}

function setCategory(cat) {
    state.category = cat;
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === cat);
    });
    applyFilters();
}

function resetAll() {
    document.getElementById('mainSearch').value = '';
    document.getElementById('filterPrice').checked = false;
    document.getElementById('filter3D').checked = false;
    document.getElementById('filterBlueprint').checked = false;
    document.getElementById('sortSelect').value = 'newest';
    setCategory('all');
}

function renderListings(data) {
    const grid = document.getElementById('listingsGrid');
    document.getElementById('resultsCount').innerText = data.length;
    
    if (data.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-20 text-gray-500 bg-[#1a2332] rounded-xl border border-[#2d3f52]">Ничего не найдено по заданным критериям</div>`;
        return;
    }

    grid.innerHTML = data.map(item => `
        <div class="bg-[#1a2332] rounded-xl border border-[#2d3f52] overflow-hidden card-hover group cursor-pointer flex flex-col" onclick="openModal(${item.id})">
            <div class="relative h-52 overflow-hidden bg-gray-800">
                <img src="${item.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="${item.title}" onerror="this.src='https://via.placeholder.com/800x600/1a2332/9ca3af?text=No+Image'">
                <span class="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white badge-${item.status} shadow-sm">${item.statusLabel}</span>
                <div class="absolute top-3 right-3 flex gap-2">
                    ${item.has3D ? '<span class="px-2 py-1 rounded-md text-[10px] font-bold text-white bg-blue-600 shadow-sm flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/></svg> 3D</span>' : ''}
                    ${item.hasBlueprint ? '<span class="px-2 py-1 rounded-md text-[10px] font-bold text-white bg-indigo-600 shadow-sm flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> Чертеж</span>' : ''}
                </div>
            </div>
            <div class="p-5 flex flex-col flex-1">
                <div class="text-xs text-amber-500 font-mono font-medium mb-1.5 uppercase tracking-wide">${item.categoryLabel} • ${item.country}</div>
                <h3 class="text-lg font-bold text-white mb-2 leading-tight line-clamp-2">${item.title}</h3>
                <div class="flex items-center text-sm text-gray-400 mb-4 mt-auto">
                    <svg class="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    ${item.location} • ${item.year} г.
                </div>
                <div class="flex items-center justify-between pt-4 border-t border-[#2d3f52]">
                    <span class="text-xl font-bold text-white font-mono">${formatPrice(item.price)}</span>
                    <button class="px-3 py-2 rounded-lg bg-[#243447] hover:bg-amber-600 text-white text-xs font-semibold transition flex items-center gap-2" onclick="event.stopPropagation(); toggleCompare(${item.id})">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                        Сравнить
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// --- MODAL & MAP ---
function openModal(id) {
    const item = listingsData.find(l => l.id === id);
    if (!item) return;

    const specsHtml = Object.entries(item.attributes).map(([key, val]) => `
        <div class="spec-row flex justify-between py-3 text-sm">
            <span class="text-gray-400">${key}</span>
            <span class="text-white font-medium text-right">${val}</span>
        </div>
    `).join('');

    const compatibleHtml = item.compatible.map(comp => `
        <span class="px-3 py-1.5 rounded-lg bg-[#243447] border border-[#2d3f52] text-xs text-amber-500 font-medium cursor-pointer hover:border-amber-500 transition">${comp}</span>
    `).join('');

    document.getElementById('modalContent').innerHTML = `
        <div class="grid md:grid-cols-2">
            <div class="relative h-64 md:h-auto bg-black">
                <img src="${item.image}" class="w-full h-full object-cover" alt="${item.title}">
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a2332] to-transparent h-24"></div>
            </div>
            <div class="p-6 md:p-8">
                <div class="flex items-center gap-2 mb-3">
                    <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white badge-${item.status}">${item.statusLabel}</span>
                    <span class="text-xs text-gray-400 font-mono">ID: ${String(item.id).padStart(6, '0')}</span>
                </div>
                <h2 class="text-3xl font-bold text-white mb-2">${item.title}</h2>
                <p class="text-2xl font-mono font-bold text-amber-500 mb-6">${formatPrice(item.price)}</p>
                
                <div class="space-y-1 mb-6">${specsHtml}</div>

                <div class="mb-6">
                    <h4 class="text-sm font-semibold text-white mb-2">Описание</h4>
                    <p class="text-sm text-gray-400 leading-relaxed">${item.description}</p>
                </div>

                <div class="mb-6">
                    <h4 class="text-sm font-semibold text-white mb-3">Совместимые компоненты</h4>
                    <div class="flex flex-wrap gap-2">${compatibleHtml}</div>
                </div>

                <div class="flex gap-3 mt-8">
                    <button onclick="alert('Функция чата с продавцом будет доступна после подключения бэкенда')" class="flex-1 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition shadow-lg shadow-amber-900/20">Связаться с продавцом</button>
                    <button class="px-4 py-3 rounded-lg border border-[#2d3f52] text-gray-300 hover:border-amber-500 hover:text-amber-500 transition" onclick="toggleCompare(${item.id})">
                        ${comparisonList.includes(item.id) ? 'Убрать из сравнения' : 'В сравнение'}
                    </button>
                </div>
            </div>
        </div>
        <div class="border-t border-[#2d3f52] p-6 md:p-8 bg-[#151c27]">
            <h4 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                Местоположение: ${item.location}
            </h4>
            <div id="modalMap" class="map-container w-full border border-[#2d3f52]"></div>
        </div>
    `;

    document.getElementById('detailModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        if (activeMap) activeMap.remove();
        activeMap = L.map('modalMap').setView(item.coordinates, 10);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '©OpenStreetMap, ©CartoDB',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(activeMap);
        L.marker(item.coordinates).addTo(activeMap).bindPopup(`<b>${item.title}</b><br>${item.location}`).openPopup();
    }, 150);
}

function closeModal() {
    document.getElementById('detailModal').classList.add('hidden');
    document.body.style.overflow = '';
    if (activeMap) { activeMap.remove(); activeMap = null; }
}

// --- COMPARISON ---
function toggleCompare(id) {
    if (comparisonList.includes(id)) {
        comparisonList = comparisonList.filter(itemId => itemId !== id);
    } else {
        if (comparisonList.length >= 3) {
            alert("Можно сравнивать максимум 3 единицы техники одновременно.");
            return;
        }
        comparisonList.push(id);
    }
    updateComparisonUI();
}

function updateComparisonUI() {
    const panel = document.getElementById('comparisonPanel');
    const container = document.getElementById('comparisonItems');
    
    if (comparisonList.length === 0) {
        panel.classList.add('hidden');
        return;
    }
    
    panel.classList.remove('hidden');
    container.innerHTML = comparisonList.map(id => {
        const item = listingsData.find(l => l.id === id);
        return `
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#243447] border border-[#2d3f52]">
                <span class="text-sm text-white truncate max-w-[150px]">${item.title}</span>
                <button onclick="toggleCompare(${id})" class="text-gray-400 hover:text-red-500 transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
        `;
    }).join('');
}

function clearComparison() {
    comparisonList = [];
    updateComparisonUI();
}

function showComparison() {
    if (comparisonList.length < 2) {
        alert("Выберите минимум 2 единицы техники для сравнения.");
        return;
    }
    const items = comparisonList.map(id => listingsData.find(l => l.id === id));
    let html = `<div class="p-8"><h2 class="text-2xl font-bold text-white mb-6">Сравнение характеристик</h2><div class="overflow-x-auto"><table class="w-full text-left border-collapse">`;
    
    html += `<tr><th class="p-3 border-b border-[#2d3f52] text-gray-400 font-normal">Характеристика</th>`;
    items.forEach(item => { html += `<th class="p-3 border-b border-[#2d3f52] text-white font-bold min-w-[200px]">${item.title}</th>`; });
    html += `</tr>`;

    const allKeys = new Set();
    items.forEach(item => Object.keys(item.attributes).forEach(k => allKeys.add(k)));
    allKeys.add("Цена");
    allKeys.add("Боевая масса (т)");
    allKeys.add("Год");

    allKeys.forEach(key => {
        html += `<tr class="hover:bg-[#243447] transition">`;
        html += `<td class="p-3 border-b border-[#2d3f52] text-gray-400 font-medium">${key}</td>`;
        items.forEach(item => {
            let val = "—";
            if (key === "Цена") val = formatPrice(item.price);
            else if (key === "Боевая масса (т)") val = item.combatWeight + " т";
            else if (key === "Год") val = item.year;
            else val = item.attributes[key] || "—";
            html += `<td class="p-3 border-b border-[#2d3f52] text-white">${val}</td>`;
        });
        html += `</tr>`;
    });

    html += `</table></div><div class="mt-6 text-right"><button onclick="closeModal()" class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition">Закрыть</button></div></div>`;
    
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('detailModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', async () => {
    // Привязываем поиск к вводу с задержкой (debounce)
    let timeout;
    document.getElementById('mainSearch').addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            state.search = e.target.value.toLowerCase();
            applyFilters();
        }, 300);
    });
    
    await applyFilters(); // Первичный рендер с загрузкой данных из API
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});
