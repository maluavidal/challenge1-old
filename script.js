const data = {
    "insurances": [{
        "id": 3322,
        "name": "Amil"
    }, {
        "id": 3293,
        "name": "Bradesco"
    }, {
        "id": 99231,
        "name": "Hapvida"
    }, {
        "id": 1322,
        "name": "CASSI"
    }, {
        "id": 23111,
        "name": "Sulamérica"
    }],
    "guides": [{
        "number": "3210998321",
        "start_date": "2021-04-23T19:18:47.210Z",
        "patient": {
            "id": 9321123,
            "name": "Augusto Ferreira",
            "thumb_url": "https://imgsapp2.correiobraziliense.com.br/app/noticia_127983242361/2019/10/04/794834/20191004154953157610i.jpg"
        },
        "insurane_id": 1322,
        "health_insurance": {
            "id": 1322,
            "name": "CASSI",
            "is_deleted": false
        },
        "price": 5567.2
    }, {
        "number": "287312832",
        "start_date": "2021-04-23T19:18:47.210Z",
        "patient": {
            "id": 93229123,
            "name": "Caio Carneiro",
            "thumb_url": "http://3.bp.blogspot.com/-XG5bGlqGnJw/T9lIcssnybI/AAAAAAAADTA/B23ezXOkx8Y/s1600/Aang.jpg"
        },
        "insurane_id": 1322,
        "health_insurance": {
            "id": 1322,
            "name": "CASSI",
            "is_deleted": false
        },
        "price": 213.3
    }, {
        "number": "283718273",
        "start_date": "2021-04-22T19:18:47.210Z",
        "patient": {
            "id": 213122388,
            "name": "Luciano José",
            "thumb_url": "https://i.ytimg.com/vi/yUXd-enstO8/maxresdefault.jpg"
        },
        "insurane_id": 3293,
        "health_insurance": {
            "id": 3293,
            "name": "Bradesco",
            "is_deleted": true
        },
        "price": 88.99
    }, {
        "number": "009090321938",
        "start_date": "2021-04-20T19:18:47.210Z",
        "patient": {
            "id": 3367263,
            "name": "Felício Santos",
            "thumb_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPSxlYabmRlKk43uvsBMIqjA7Rw_YCwK4TyA&usqp=CAU"
        },
        "insurane_id": 3293,
        "health_insurance": {
            "id": 3293,
            "name": "Bradesco",
            "is_deleted": true
        },
        "price": 828.99
    }, {
        "number": "8787128731",
        "start_date": "2021-04-01T19:18:47.210Z",
        "patient": {
            "id": 777882,
            "name": "Fernando Raposo"
        },
        "insurane_id": 3322,
        "health_insurance": {
            "id": 3322,
            "name": "Amil",
            "is_deleted": false
        },
        "price": 772
    }, {
        "number": "12929321",
        "start_date": "2021-04-02T19:18:47.210Z",
        "patient": {
            "id": 221,
            "name": "Paciente com nome grante pra colocar text ellipsis testando nome com paciente grande"
        },
        "insurane_id": 3322,
        "health_insurance": {
            "id": 3322,
            "name": "Amil",
            "is_deleted": false
        },
        "price": 221
    }]
}

const { insurances, guides } = data;
const table = document.getElementById('table');
const tbody = document.getElementById('tbody');
const select = document.getElementById('sel');
const search = document.getElementById('search');

const renderTable = (guides) => {
    let html = '';

    if(guides.length === 0) {
        html += `
        <tr>
            <td colspan="5" id="footer">Nenhuma guia encontrada</td>
        </tr>
        `
    }

    guides.forEach(guide => {
        let riscado = '';
        let hover = '';

        if(guide.health_insurance.is_deleted) {
            riscado = 'riscado';
            hover = 'Convênio Apagado';
        };

        html += `
        <tr>
            <td>${new Date(guide.start_date).toLocaleDateString('pt-BR')}</td>
            <td>${guide.number}</td>
            <td><img id="img" src="${guide.patient.thumb_url || "https://via.placeholder.com/150x150.jpg"}"/>${guide.patient.name}</td>
            <td class="${riscado}" title="${hover}">${guide.health_insurance.name}</td>
            <td>${guide.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL'})}</td>
        </tr>
        `
    });

    tbody.innerHTML = html;
}

renderTable(guides)

const renderSelect = (insurances) => {
    let html = `<option value="">Convênio</option>`;
    
    insurances.forEach(insurance => {
        html += `<option value="${insurance.id}">${insurance.name}</option>`
    });

    select.innerHTML = html;
}

renderSelect(insurances);


const filterTable = () => {
    const selectValue = ~~document.getElementById('sel').value;
    const inputValue = search.value;
    inputValue.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    console.log(inputValue);
    
    if(!selectValue && !inputValue) {
        return renderTable(guides);
    }
    
    const filteredInsurances = guides.filter(element => {
        let isValid = true;
        const patientName = element.patient.name.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        if(!patientName.includes(inputValue)) {
            isValid = false;
        }

        if(!(element.health_insurance.id === selectValue || selectValue === 0)) {
            isValid = false;
        }

        return isValid;
    })    

    renderTable(filteredInsurances);
}

filterTable();

