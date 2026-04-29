const nomeCidade = document.querySelector('#nome-cidade');
const form = document.getElementById('formulario');
const resultado = document.getElementById('cidade')
const dataHoje = document.getElementById('data');


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
        })

        



        

    }catch(error){
        console.log(error);
    }
    
});


