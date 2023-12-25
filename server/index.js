const WebSocket = require('ws');
const http = require('http');
const server = http.createServer((req, res) => {

})
const wss = new WebSocket.Server({server});
wss.on('connection', ws => {
    console.log('working ws');

    // initial data for display on init
    initMockData(ws);

    let counter = 0;
    let interval = setInterval(() => {
        generateData(ws);
        counter++;
        if (counter > 19) {
            clearInterval(interval)
        }
    }, 400)

    ws.on('message', msg => {
        console.log(msg);
    })

    ws.on('close', () => {
        console.log('connection ended');
    });

})

server.listen(4202, () => {
    console.log('server listening')
});

const DEFAULT_FRACTION_DIGITS = 6;

// MOCK DATA
function initMockData(ws) {
    let data = {
        timestamp: 1702230572123, // Integer, milliseconds since epoch
        frequency: 460.0, // Float, radio frequency in MHz
        point: {
            lat: 50.01, // Float, Latitude
            lon: 30.01 // Float, Longitude
        },
        zone: [
            {lat: 50.01, lon: 30.01},
            {lat: 50.010386, lon: 30.009485},
            {lat: 50.010572, lon: 30.009721},
            {lat: 50.010572, lon: 30.010526},
            {lat: 50.010124, lon: 30.010858},
            {lat: 50.009703, lon: 30.010590},
            {lat: 50.009635, lon: 30.009785},
            {lat: 50.009890, lon: 30.009088}
        ]
    }
}

function generateData(ws) {
    const data = {
        timestamp: Date.now(),
        frequency: (Math.random()*1200).toFixed(1),
        point: {
            lat: generateRandomLat(2),
            lon: generateRandomLong(2)
        },
    };
    data.zone = generateZoneValues(data.point.lat, data.point.lon)
    const dataString = JSON.stringify(data)
    ws.send(dataString);
}

function generateRandomLong(fractionDigits, min, max) {
    if (!max) max = 180;
    if (!min) min = 0;
    if (!fractionDigits) fractionDigits = DEFAULT_FRACTION_DIGITS;
    return Math.random().toFixed(fractionDigits) * (max - min - 1) + min;
}

function generateRandomLat(fractionDigits, min, max) {
    if (!max) max = 90;
    if (!min) min = 0;
    if (!fractionDigits) fractionDigits = DEFAULT_FRACTION_DIGITS;
    return Math.random().toFixed(fractionDigits) * (max - min - 1) + min;
}

function generateZoneValues(centerLat, centerLong) {
    let values = [];
    let arrLength = Math.floor(Math.random() * 10);
    for (let i = 0; i < arrLength; i++) {
        const location = {
            lat: generateRandomLat(DEFAULT_FRACTION_DIGITS, centerLat - 1, centerLat + 1),
            lon: generateRandomLong(DEFAULT_FRACTION_DIGITS, centerLong - 1, centerLong + 1)
        }
        values.push(location)
    }
    return values;
}