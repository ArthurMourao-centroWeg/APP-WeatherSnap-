const nomeCidade = document.querySelector('#nome-cidade');
const form = document.getElementById('formulario');
const resultado = document.getElementById('cidade');
const dataHoje = document.getElementById('data');
const vento = document.getElementById('vento');
const precipitacao = document.getElementById('precipitacao');
const temperatura = document.getElementById('temperatura');
const tempo = document.getElementById('informacao-tempo');
const body = document.getElementById('body');



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
            month: 'long'
        });

        const tempUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=is_day,weather_code,temperature_2m,relative_humidity_2m,wind_speed_10m,rain,apparent_temperature,precipitation,cloud_cover,snowfall&past_days=0&forecast_days=7`

        const tempRes = await fetch(tempUrl);

        const tempData = await tempRes.json();

        const { 
            temperature_2m, 
            wind_speed_10m,
            precipitation, 
            rain,
            cloud_cover, 
            is_day,
            weather_code, 
            apparent_temperature 
        } = tempData.current;


        temperatura.innerText = temperature_2m;
        precipitacao.innerText = precipitation;
        vento.innerText = `${wind_speed_10m} Km/h`;
        definirStatusTempo(rain,cloud_cover);
        

        definirStatusTempo3dias(hoje,latitude,longitude);



    }catch(error){
        console.log(error);
    }
    
});


function definirStatusTempo(rain, cloud_cover){
    if(rain>0){
        if(rain <= 0.3){
            tempo.innerText = 'Chuva fraca, Você não é de açucar';
        
        }
        else if(rain <=0.6){
            tempo.innerText = 'Melhor levar um guarda-chuva';
            
        }else{
            tempo.innerText = 'Fica em casa que o trem lá fora ta feio';
            
        }
        document.body.classList.add('chuva');
    }else{
        document.body.classList.remove('chuva');

        if(cloud_cover >= 0 && cloud_cover <=20){        
            document.classList.remove('vai-vim-chuva')
            tempo.innerText = 'Tá bom pra ganhar uma vitamina D';
        }
        else if(cloud_cover >= 21 && cloud_cover <=55){
            document.classList.remove('vai-vim-chuva')
            tempo.innerText = 'Tempo está nublado';
        }
        else{
            tempo.innerText = 'Tempo fechado';  
            document.body.classList.add('vai-vim-chuva')
        }
    }
    
}

async function definirStatusTempo3dias(hoje, latitude, longitude) {
    const dias = [
        document.getElementById('dia-1'),
        document.getElementById('dia-2'),
        document.getElementById('dia-3'),
    ];
    const temperaturas = [
        document.getElementById('temperatura-1'),
        document.getElementById('temperatura-2'),
        document.getElementById('temperatura-3'),
    ];
    for (let i = 0; i < 3; i++) {
        let data = new Date(hoje);
        data.setDate(data.getDate() + i + 1);
        dias[i].innerText = data.toLocaleDateString('pt-br', {
            day: 'numeric',
            month: '2-digit',
        });

        let ano = data.getFullYear();
        let mes = String(data.getMonth() + 1).padStart(2, '0');
        let dia = String(data.getDate()).padStart(2, '0');
        let dataUrl = `${ano}-${mes}-${dia}`;

        try {
            let urlDefinirStatus = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${dataUrl}&end_date=${dataUrl}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
            const tempResStatus = await fetch(urlDefinirStatus);
            const tempDataStatus = await tempResStatus.json();

            temperaturas[i].innerText = `${tempDataStatus.daily.temperature_2m_min[0]}°/${tempDataStatus.daily.temperature_2m_max[0]}°`;
        } catch (error) {
            console.log(error);
            temperaturas[i].innerText = 'Erro';
        }
    }
}

function definirBackgorund(weather_code){

    if(weather_code >=0 && weather_code <=2){
                console.log('Ceu Limpo');
            }else if(weather_code == 3){
                console.log('Tempo nublado')
            }else if(weather_code >=51 && weather_code <=57 || weather_code>=61){
                console.log('Chuva');
                
            }
}


