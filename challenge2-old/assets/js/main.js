const urlGuides = 'https://augustoferreira.com/augustoferreira/amigo/guides.json'
const urlInsurances = 'https://augustoferreira.com/augustoferreira/amigo/insurances.json'

const table = document.getElementById('table');
const tbody = document.getElementById('tbody');
const select = document.getElementById('select');
const search = document.getElementById('search');
const dateStartInput = document.getElementById('month-start');
const dateEndInput = document.getElementById('month-end');

const itemsPerPage = 2;

let currentPage = 1;
let filteredGuides;
let guidesAmount;
let guides = [];
let insurances;

const init = async () => {
    const [{ data: getGuidesResponse }, { data: insurances }] = await Promise.all([
        getFetch(urlGuides),
        getFetch(urlInsurances)
    ]);

    guides = getGuidesResponse.guides;

    changeDateFilter('month');
    renderTable(guides);
    renderSelectedInsurances(insurances);
    filterTable();
    paginationStructure(filteredGuides, 2);
};

const getFetch = async url => {
    const response = await fetch(url)
    return await response.json()
}

const renderTable = guidesParams => {
    let html = '';
    filteredGuides = guidesParams;

    console.log(guidesParams)
    if (!guidesParams.length) {
        html += `
        <tr>
        <td colspan="5" id="footer">Nenhuma guia encontrada</td>
        </tr>
        `
    }

    guidesParams.forEach(async guide => {
        const priceValue = guide.price === 'NaN' ? 0 : guide.price;
        const healtinsuranceName = guide && guide.health_insurance && guide.health_insurance.name ? guide.health_insurance.name : '';
        const healthInsuranceClass = guide && guide.health_insurance && guide.health_insurance.is_deleted ? 'class="deleted" title="Convênio apagado"' : '';

        html += `
        <tr>
            <td>${new Date(guide.start_date).toLocaleDateString('pt-BR')}</td>
            <td>${guide.number || '-'}</td>
            <td><img id="img" src="${guide.patient.thumb_url || "https://via.placeholder.com/150x150.jpg"}"/>${guide.patient.name}</td>
            <td ${healthInsuranceClass}>${healtinsuranceName}</td>
            <td>${priceValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
        </tr>
        `
    });

    tbody.innerHTML = html;
};

const renderSelectedInsurances = insurancesParams => {
    insurances = insurancesParams;
    let html = `<option value="">Convênio</option>`;

    insurances.forEach(insurance => {
        html += `<option value="${insurance.id}">${insurance.name}</option>`
    });

    select.innerHTML = html;
};

const formatDate = date => {
    return new Date(date).toISOString().slice(0, 10);
};

const changeDateFilter = buttonType => {
    const monthBtn = document.getElementById('month');
    const todayBtn = document.getElementById('today');

    if (buttonType === 'month') {
        const rawDate = new Date();
        const firstDay = new Date(rawDate.getFullYear(), rawDate.getMonth(), 1);
        dateStartInput.value = `${formatDate(firstDay)}`;

        const lastDay = new Date(rawDate.getFullYear(), rawDate.getMonth() + 1, 0);
        dateEndInput.value = `${formatDate(lastDay)}`;

        todayBtn.classList.remove('active');
        monthBtn.classList.add('active');
    }

    if (buttonType === 'today') {
        dateStartInput.value = `${formatDate(new Date())}`;
        dateEndInput.value = `${formatDate(new Date())}`;
        monthBtn.classList.remove('active');
        todayBtn.classList.add('active');
    }

    if (!buttonType) {
        monthBtn.classList.remove('active');
        todayBtn.classList.remove('active');
    }

    filterTable();
};

const normalizeValue = value => {
    return value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const paginate = (page = 1, filtered) => {
    currentPage = page;

    const offset = (currentPage - 1) * itemsPerPage;
    const slicedItemsWithOffset = filtered && filtered.slice(offset);
    const paginatedGuides = slicedItemsWithOffset && slicedItemsWithOffset.slice(0, itemsPerPage);

    paginationStructure(filteredGuides, 2);
    renderTable(paginatedGuides);
};

const paginationStructure = (guides, itemsPerPage) => {
    const pages = document.getElementById('pages');
    guidesAmount = filteredGuides.length;
    const totalPages = Math.ceil(guides.length / itemsPerPage);
    let html = '';

    if (guidesAmount) {
        html += `
        <li class="page-item"><a id="firstPage" class="page-link " href="#" onClick="onPageChange(1)">Primeira</a><li>
        <li class="page-item"><a id="previousPage"class="page-link " href="#" onClick="onPageChange(currentPage - 1)">Anterior</a><li>
        `

        for (let i = 1; i <= totalPages; i++) {
            let active
            (i === currentPage) ? active = 'active' : ''
            html += `
            <li class="page-item"><a id="currentPage" class="page-link ${active}" currentPage="${i}" href="#" onClick="onPageChange(${i})">${i}</a><li>
            `
        }

        html += `
            <li class="page-item"><a id="nextPage" class="page-link " href="#" onClick="onPageChange(currentPage + 1)" >Próxima</a><li>
            <li class="page-item"><a id="lastPage" class="page-link " href="#" onClick="onPageChange(${totalPages})">Última</a><li>
            `
    }

    pages.innerHTML = html;
};

const onPageChange = (currentPage) => {
    if (currentPage < 1) {
        currentPage = 1;
    }

    if (currentPage > guidesAmount / 2) {
        return;
    }

    filterTable(currentPage);
}

const filterTable = (currentPage) => {
    const selectValue = ~~document.getElementById('select').value;
    const searchInputValue = normalizeValue(search.value);
    const dateStartInputValue = document.getElementById('month-start').value;
    const dateEndInputValue = document.getElementById('month-end').value;

    if (!dateStartInputValue && !dateEndInputValue) {
        paginate(guides);
    }

    if (!selectValue && !searchInputValue && !dateStartInputValue && !dateEndInputValue) {
        return;
    }

    filteredGuides = guides.filter(element => {
        let isValid = true;
        const patientName = normalizeValue(element.patient.name);
        const number = element.number;
        const startDate = formatDate(element.start_date);


        if (!patientName.includes(searchInputValue) && !number.includes(searchInputValue)) {
            isValid = false;
        }

        if (selectValue && element.health_insurance?.id !== selectValue) {
            isValid = false;
        }

        if (!dateEndInputValue && !dateStartInputValue) {
            isValid = false;
        }

        if (!(startDate > dateStartInputValue && startDate < dateEndInputValue)) {
            isValid = false;
        }

        return isValid;

    });

    filteredGuides.sort((date, nextDate) => {
        if (formatDate(date.start_date) > formatDate(nextDate.start_date)) {
            return 1;
        }

        if (formatDate(date.start_date) < formatDate(nextDate.start_date)) {
            return -1;
        }

        return 0;
    });

    // renderTable(paginatedGuides);

    paginate(currentPage, filteredGuides);
};

init();