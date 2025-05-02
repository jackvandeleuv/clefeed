async function getCrimeData(minLat, maxLat, minLng, maxLng) {
    const url = `https://services3.arcgis.com/dty2kHktVXHrqO8i/arcgis/rest/services/Crime_Incidents/FeatureServer/0/query?where=1%3D1&outFields=PrimaryKey,CaseNumber,UCRdesc,ReportedDate,OffenseDate,Statute,Address_Public,LAT,LON,StatDesc&geometry=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&geometryType=esriGeometryEnvelope&orderByFields=OffenseDate+DESC&inSR=4326&spatialRel=esriSpatialRelIntersects&resultRecordCount=100&outSR=4326&f=json`;
    
    const response = await fetch(url);
    const data = await response.json();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const results = [];
    for (const row of data.features) {
        const row_data = row.attributes;
        const date = new Date(row_data.OffenseDate);
        results.push({
            date: date,
            longitude: row.geometry.x,
            latitude: row.geometry.y,            
            label: `
                <div class="popup">
                    <h2>${row_data.UCRdesc}</h2>
                    <h4>${row_data.Statute}<h4>
                    <h4>${row_data.StatDesc}<h4>
                    <h4>${row_data.Address_Public}<h4>
                    <h4>Offense Date: ${date}</h4>
                    <h4>Reported Date: ${new Date(row_data.ReportedDate)}<h4>
                </div>
            `,
            color: 'rgb(255, 185, 111)',
            html: `
                <div class="resultBox">
                    <div class="resultLabel crime">Crime</div>
                        <div class="result">
                        <h2>${row_data.StatDesc}</h2>
                        <p>${row_data.UCRdesc}</p>
                        <div class="typeBox">
                            <p>${days[date.getDay()]}, ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</p>
                            <p>${row_data.Address_Public}</p>
                        </div>
                    </div>
                </div>
            `
        });      
    }
    return results
}

async function get311Data(minLat, maxLat, minLng, maxLng) {
    const url = `https://services3.arcgis.com/dty2kHktVXHrqO8i/arcgis/rest/services/Data_311/FeatureServer/0/query?where=1%3D1&outFields=service_request_id,status_description,source,address,requested_datetime,service_name&geometry=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&geometryType=esriGeometryEnvelope&orderByFields=requested_datetime+DESC&inSR=4326&spatialRel=esriSpatialRelIntersects&resultRecordCount=100&outSR=4326&f=json`;
    
    const response = await fetch(url);
    const data = await response.json();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const results = [];
    for (const row of data.features) {
        const row_data = row.attributes;
        const date = new Date(row_data.requested_datetime);
        results.push({
            date: date,
            longitude: row.geometry.x,
            latitude: row.geometry.y,   
            label: `
                <div class="popup">
                    <h2>${row_data.service_name}</h2>
                    <h4>${row_data.address}<h4>
                    <h4>${date}</h4>
                    <h4>Status: ${row_data.status_description}</h4>
                    <h4>Source: ${row_data.source}</h4>
                </div>
            `,
            color: 'rgb(50, 252, 175)',
            html: `
                <div class="resultBox">
                    <div class="resultLabel request">311 Request</div>
                    <div class="result">
                        <h2>${row_data.service_name}</h2>
                        <p>${row_data.service_request_id}</p>
                        <div class="typeBox">
                            <p>${days[date.getDay()]}, ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</p>
                        </div>
                    </div>
                </div>
            `
        });      
    }
    return results
}

async function getPoliceData(minLat, maxLat, minLng, maxLng) {
    const url = `https://services3.arcgis.com/dty2kHktVXHrqO8i/arcgis/rest/services/CAD_Police/FeatureServer/0/query?where=1%3D1&outFields=typ_eng,sub_eng,first_dispo_eng,address,eid,call_datetime&geometry=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&geometryType=esriGeometryEnvelope&orderByFields=call_datetime+DESC&inSR=4326&spatialRel=esriSpatialRelIntersects&resultRecordCount=100&outSR=4326&f=json`;
    
    const response = await fetch(url);
    const data = await response.json();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const results = [];
    for (const row of data.features) {
        const row_data = row.attributes;
        const date = new Date(row_data.call_datetime);
        results.push({
            date: date,
            longitude: row.geometry.x,
            latitude: row.geometry.y,   
            label: `
                <div class="popup">
                    <h2>${row_data.typ_eng} | ${row_data.sub_eng}</h2>
                    <h4>${row_data.first_dispo_eng}</h4>
                    <h4>${row_data.address}<h4>
                    <h4>${date}</h4>
                </div>
            `,
            color: 'rgb(140, 184, 250)',
            html: `
                <div class="resultBox">
                    <div class="resultLabel police">Police Call</div>
                    <div class="result">
                        <h2>${row_data.typ_eng}</h2>
                        <p>${row_data.first_dispo_eng}</p>
                        <div class="typeBox">
                            <p>${days[date.getDay()]}, ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</p>
                            <p>${row_data.address}</p>
                        </div>
                    </div>
                </div>
            `
        });      
    }
    return results
}

async function getFireData(minLat, maxLat, minLng, maxLng) {
    const url = `https://services3.arcgis.com/dty2kHktVXHrqO8i/arcgis/rest/services/CAD_Fire/FeatureServer/0/query?where=1%3D1&outFields=typ_eng,sub_eng,first_dispo_eng,address,eid,call_datetime&geometry=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&geometryType=esriGeometryEnvelope&orderByFields=call_datetime+DESC&inSR=4326&spatialRel=esriSpatialRelIntersects&resultRecordCount=100&outSR=4326&f=json`;
    
    const response = await fetch(url);
    const data = await response.json();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const results = [];
    for (const row of data.features) {
        const row_data = row.attributes;
        const date = new Date(row_data.call_datetime);
        // longitude: row.geometry.x + ((Math.random() - 0.5) * 0.00024),
        // latitude: row.geometry.y + ((Math.random() - 0.5) * 0.00018),  
        results.push({
            longitude: row.geometry.x,
            latitude: row.geometry.y,  
            date: date,
            label: `
                <div class="popup">
                    <h2>${row_data.typ_eng} | ${row_data.sub_eng}</h2>
                    <h4>${row_data.first_dispo_eng}</h4>
                    <h4>${row_data.address}<h4>
                    <h4>${date}</h4>
                </div>
            `,
            color: 'rgb(250, 140, 140)',
            html: `
                <div class="resultBox">
                    <div class="resultLabel fire">Fire Call</div>
                    <div class="result">
                        <h2>${row_data.typ_eng}</h2>
                        <p>${row_data.first_dispo_eng}</p>
                        <div class="typeBox">
                            <p>${days[date.getDay()]}, ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</p>
                            <p>${row_data.address}</p>
                        </div>
                    </div>
                </div>
            `
        });      
    }
    return results
}

async function updateResults() {
    if (lat === -1 || lon === -1) return;
    for (const marker of markers) marker.remove();

    const resultContainer = document.getElementById('resultBoxContainer');
    const radiusSelector = document.getElementById('radiusSelector');

    const radius = radiusSelector.value;

    resultContainer.innerHTML = '<progress></progress>';

    if (circle !== null) circle.remove();

    circle = L.circle([lat, lon], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: radius
    }).addTo(map);

    const minLat = lat - (radius / 111320);
    const maxLat = lat + (radius / 111320);
    const minLng = lon - (radius / (Math.cos(lon) * 111320));
    const maxLng = lon + (radius / (Math.cos(lon) * 111320));

    let results = [];

    if (currentTargetId === 'crimeButton' || currentTargetId === 'allButton') results.push(getCrimeData(minLat, maxLat, minLng, maxLng));
    if (currentTargetId === 'policeButton' || currentTargetId === 'allButton') results.push(getPoliceData(minLat, maxLat, minLng, maxLng));
    if (currentTargetId === 'fireButton' || currentTargetId === 'allButton') results.push(getFireData(minLat, maxLat, minLng, maxLng));
    if (currentTargetId === 'requestButton' || currentTargetId === 'allButton') results.push(get311Data(minLat, maxLat, minLng, maxLng));

    results = await Promise.all(results);

    const flatResults = results.flat();
    flatResults.sort((a, b) => b.date - a.date);
    const topFlatResults = flatResults.slice(0, 30);

    for (const result of topFlatResults) {
        const marker = L.marker(
            [result.latitude, result.longitude], 

            {icon: L.divIcon({html: `
                <div style="
                    background-color: ${result.color};
                    width: 24px; 
                    height: 24px;
                    border: 2px solid white;
                    border-radius: 50%;
                    box-shadow: 0 0 3px rgba(0,0,0,0.5);
                "></div>    
            `})}

        ).addTo(map);
        marker.bindPopup(result.label);
        markers.push(marker);
    }

    const html = topFlatResults.map((result) => result.html);

    resultContainer.innerHTML = html.join('\n');
}

async function onMapClick(e) {  
    lat = e.latlng.lat;
    lon = e.latlng.lng; 
    updateResults();
}

async function addButtonAction(event) {
    event.preventDefault();
    let targetId = event.target.id;

    let targetButton = document.getElementById(targetId);
    let lastTargetButton = document.getElementById(currentTargetId);

    targetButton.classList.add("activeButton");
    lastTargetButton.classList.remove("activeButton");
    currentTargetId = targetId;

    updateResults();
}


const map = L.map('map').setView([41.482505, -81.712028], 16);

let circle = null;

const markers = [];

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let currentTargetId = 'allButton';
let lat = -1;
let lon = -1;

map.on('click', onMapClick);

const buttonIds = ['allButton', 'crimeButton', 'policeButton', 'fireButton', 'requestButton'];
for (const id of buttonIds) {
    const button = document.getElementById(id);
    button.addEventListener('click', async (event) => addButtonAction(event));
}
