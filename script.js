const map = L.map('map').setView([41.497335, -81.700197], 13);
let circle = null;

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

async function getCrimeData(minLat, maxLat, minLng, maxLng) {
    const url = `https://services3.arcgis.com/dty2kHktVXHrqO8i/arcgis/rest/services/Crime_Incidents/FeatureServer/0/query?where=1%3D1&outFields=PrimaryKey,CaseNumber,UCRdesc,ReportedDate,OffenseDate,Statute,Address_Public,LAT,LON,StatDesc&geometry=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&geometryType=esriGeometryEnvelope&orderByFields=OffenseDate+DESC&inSR=4326&spatialRel=esriSpatialRelIntersects&resultRecordCount=10&outSR=4326&f=json`;
    
    const response = await fetch(url);
    const data = await response.json();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const results = [];
    for (const row of data.features) {
        const row_data = row.attributes;
        const date = new Date(row_data.OffenseDate);
        results.push({
            'date': date,
            'html': `
                <div class="resultBox crime">
                    <h2>${row_data.StatDesc}</h2>
                    <p>${row_data.UCRdesc}</p>
                    <div class="typeBox">
                        <p>${days[date.getDay()]}, ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</p>
                        <p>${row_data.Address_Public}</p>
                    </div>
                </div>
            `
        });      
    }
    return results
}

async function get311Data(minLat, maxLat, minLng, maxLng) {
    const url = `https://services3.arcgis.com/dty2kHktVXHrqO8i/arcgis/rest/services/Data_311/FeatureServer/0/query?where=1%3D1&outFields=service_request_id,requested_datetime,service_name&geometry=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&geometryType=esriGeometryEnvelope&orderByFields=requested_datetime+DESC&inSR=4326&spatialRel=esriSpatialRelIntersects&resultRecordCount=10&outSR=4326&f=json`;
    
    const response = await fetch(url);
    const data = await response.json();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const results = [];
    for (const row of data.features) {
        const row_data = row.attributes;
        const date = new Date(row_data.requested_datetime);
        results.push({
            'date': date,
            'html': `
                <div class="resultBox request">
                    <h2>${row_data.service_name}</h2>
                    <p>${row_data.service_request_id}</p>
                    <div class="typeBox">
                        <p>${days[date.getDay()]}, ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</p>
                    </div>
                </div>
            `
        });      
    }
    return results
}

async function getPoliceData(minLat, maxLat, minLng, maxLng) {
    const url = `https://services3.arcgis.com/dty2kHktVXHrqO8i/arcgis/rest/services/CAD_Police/FeatureServer/0/query?where=1%3D1&outFields=typ_eng,sub_eng,first_dispo_eng,address,eid,call_datetime&geometry=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&geometryType=esriGeometryEnvelope&orderByFields=call_datetime+DESC&inSR=4326&spatialRel=esriSpatialRelIntersects&resultRecordCount=10&outSR=4326&f=json`;
    
    const response = await fetch(url);
    const data = await response.json();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const results = [];
    for (const row of data.features) {
        const row_data = row.attributes;
        const date = new Date(row_data.call_datetime);
        results.push({
            'date': date,
            'html': `
                <div class="resultBox police">
                    <h2>${row_data.typ_eng}</h2>
                    <p>${row_data.first_dispo_eng}</p>
                    <div class="typeBox">
                        <p>${days[date.getDay()]}, ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</p>
                        <p>${row_data.address}</p>
                    </div>
                </div>
            `
        });      
    }
    return results
}

async function getFireData(minLat, maxLat, minLng, maxLng) {
    const url = `https://services3.arcgis.com/dty2kHktVXHrqO8i/arcgis/rest/services/CAD_Fire/FeatureServer/0/query?where=1%3D1&outFields=typ_eng,sub_eng,first_dispo_eng,address,eid,call_datetime&geometry=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&geometryType=esriGeometryEnvelope&orderByFields=call_datetime+DESC&inSR=4326&spatialRel=esriSpatialRelIntersects&resultRecordCount=10&outSR=4326&f=json`;
    
    const response = await fetch(url);
    const data = await response.json();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const results = [];
    for (const row of data.features) {
        const row_data = row.attributes;
        const date = new Date(row_data.call_datetime);
        results.push({
            'date': date,
            'html': `
                <div class="resultBox fire">
                    <h2>${row_data.typ_eng}</h2>
                    <p>${row_data.first_dispo_eng}</p>
                    <div class="typeBox">
                        <p>${days[date.getDay()]}, ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</p>
                        <p>${row_data.address}</p>
                    </div>
                </div>
            `
        });      
    }
    return results
}

async function onMapClick(e) {   
    const resultContainer = document.getElementById('resultContainer');
    const radiusSelector = document.getElementById('radiusSelector');

    const radius = radiusSelector.value;

    resultContainer.innerHTML = '<progress></progress>';

    if (circle !== null) circle.remove();

    circle = L.circle([e.latlng.lat, e.latlng.lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: radius
    }).addTo(map);

    const minLat = e.latlng.lat - (radius / 111320);
    const maxLat = e.latlng.lat + (radius / 111320);
    const minLng = e.latlng.lng - (radius / (Math.cos(e.latlng.lng) * 111320));
    const maxLng = e.latlng.lng + (radius / (Math.cos(e.latlng.lng) * 111320));

    // Search all of cleveland. This is slow.
    // 41.474509, -81.744657, 41.533389, -81.626211
    // const minLat = 41.474509;
    // const maxLat = 41.533389;
    // const minLng = -81.744657;
    // const maxLng = -81.626211;

    const results = await Promise.all([
        getCrimeData(minLat, maxLat, minLng, maxLng),
        get311Data(minLat, maxLat, minLng, maxLng),
        getPoliceData(minLat, maxLat, minLng, maxLng),
        getFireData(minLat, maxLat, minLng, maxLng),
    ]);

    const flatResults = results.flat();
    flatResults.sort((a, b) => b.date - a.date);
    const html = flatResults.map((result) => result.html);

    resultContainer.innerHTML = html.join('\n');
}

map.on('click', onMapClick);
