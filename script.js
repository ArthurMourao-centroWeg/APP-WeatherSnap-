const nomeCidade = document.querySelector('#nome-cidade');
const form = document.getElementById('formulario');
const resultado = document.getElementById('cidade');
const dataHoje = document.getElementById('data');
const vento = document.getElementById('vento');
const precipitacao = document.getElementById('precipitacao');
const temp = document.getElementById('temperatura');
const tempo = document.getElementById('informacao-tempo');



form.addEventListener('submit', async (event) =>{

    event.preventDefault();

    const cidadeDigitada = nomeCidade.value;
    try{

        
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidadeDigitada)}&count=1&language=pt&format=json`;

        const geoRes = await fetch(geoUrl)

        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            resultado.innerText = "Local não encontrado";
            return;
        }

        const { latitude, longitude, name, admin1 } = geoData.results[0];

        resultado.innerText = `${name}, ${admin1}`

        console.log(`${name}, ${admin1}`)

        const hoje = new Date();

        dataHoje.innerText = hoje.toLocaleDateString('pt-br',{
            weekday: 'long', 
            day: 'numeric', 
            month: 'short'
        })

        const tempUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=is_day,temperature_2m,relative_humidity_2m,wind_speed_10m,rain,apparent_temperature,precipitation,cloud_cover,snowfall&past_days=0&forecast_days=7`

        const tempRes = await fetch(tempUrl);

        const tempData = await tempRes.json();

        const { 
            temperature_2m, 
            wind_speed_10m,
            precipitation, 
            rain,
            cloud_cover, 
            is_day, 
            apparent_temperature 
        } = tempData.current;


        temp.innerText = temperature_2m;
        precipitacao.innerText = precipitation;
        vento.innerText = `${wind_speed_10m} Km/h`;
        
        

        

    }catch(error){
        console.log(error);
    }
    
});





