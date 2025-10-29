import fastify from 'fastify'
import dotenv from 'dotenv'
import cors from '@fastify/cors'

dotenv.config()

const server = fastify({ logger: true })

await server.register(cors, {
  origin: '*' //take domain front-end
})

//weather api
server.get('/climate/:lat/:lon', async (req, rep) => {
  const { lat, lon } = req.params
  const apiKey = process.env.WEATHER_API

  try {
    const res = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`
    );
    
    if (!res.ok) {
      return rep.status(404).send({ error: 'Cidade não encontrada!' })
    }

    const data = await res.json()
    let dataText

    switch(data.current.condition.code) { //code text condition
        case 1000:
          dataText = "Ensolarado"
          break
        case 1003:
          dataText = "Parcialmente nublado"
          break
        case 1006:
          dataText = "Nublado"
          break
        case 1030:
          dataText = "Névoa"
          break
        case 1114:
          dataText = "Neve com vento"
          break
        case 1117:
          dataText = "Nevasca"
          break
        case 1135:
          dataText = "Nevoeiro"
          break
        case 1153:
          dataText = "Garoa leve"
          break
        case 1168:
          dataText = "Garoa"
          break
        case 1171:
          dataText = "Garoa forte"
          break
        case 1183:
          dataText = "Chuva leve"
          break
        case 1189:
          dataText = "Chuva moderada"
          break
        case 1195:
          dataText = "Chuva forte"
          break
        case 1204:
          dataText = "Granizo leve"
          break
        case 1213:
          dataText = "Neve leve"
          break
        case 1219:
          dataText = "Neve moderada"
          break
        case 1225:
          dataText = "Neve forte"
          break
        case 1240:
          dataText = "Pancada leve"
          break
        case 1243:
          dataText = "Pancada moderada"
          break
        case 1273:
          dataText = "Chuva leve"
          break
        case 1276:
          dataText = "Chuva moderada"
          break
        case 1279:
          dataText = "Neve leve"
          break
        case 1282:
          dataText = "Neve moderada"
          break
        default:
          dataText = "Ambíguo"
          break
    } 

    return rep.status(200).send({
      city: data.location.name, //city name
      country: data.location.country, //country name
      region: data.location.region, //region
      date: data.location.localtime, //date and hour
      temp: data.current.temp_c, //temperature
      text: dataText, //text 
      humidity: data.current.humidity, //humidity
    })
  }catch (err) {
    return rep.status(500).send({ error: 'Erro ao buscar clima!' })
  }
});

//api alerts
server.get('/alerts', async (req, rep) => {
  const apiKey = process.env.NEWS_API

  //api media stack
  const response = await fetch(`https://api.mediastack.com/v1/news?access_key=${apiKey}&limit=20&keywords=temperatura,clima&countries=br`)

  const data = await response.json()

  if(data.error){//api news data io
    const apiKey2 = process.env.NEWS2_API
    const response2 = await fetch(`https://newsdata.io/api/1/news?apikey=${apiKey2}&country=br&language=pt&q=temperatura,clima&size=10`)

    const data2 = await response2.json()
    return rep.status(200).send({ //return news data
      article_id: data2.article_id,
      title: data2.title,
      link: data2.link,
      description: data2.description,
      img_url: data2.image_url
    })
  }

  //api media stack
    return rep.status(200).send({
      data
    })
})

//init server
const start = async () => {
  try{
    server.listen({
      host: '0.0.0.0',
      port: process.env.PORT ?? 3000
    })

    server.log.info('Server running...')
  } catch(err){
    server.log.error(err)
    process.exit(1)
  }
}

start()