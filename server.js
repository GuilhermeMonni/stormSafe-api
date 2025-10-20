import fastify from 'fastify'
import dotenv from 'dotenv'
import cors from '@fastify/cors'

dotenv.config()

const server = fastify({ logger: true })

await server.register(cors, {
  origin: '*' //take domain front-end
})

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
    return rep.status(200).send(data)
  }catch (err) {
    return rep.status(500).send({ error: 'Erro ao buscar clima!' })
  }
});

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