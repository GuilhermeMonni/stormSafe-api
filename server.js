import fastify from "fastify"
import dotenv from 'dotenv'

dotenv.config()

const server = fastify()
const apiKey = process.env.WEATHER_API

server.post('/searchClimate', async (req, rep) => {
    //get infos 
    const { city } = req.body

    try{
        const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`)

        const data = await res.json()
        rep.send(data)
    }catch(err){
        return rep.code(500).send({
            error: 'Erro na busca do clima.'
        })
    }
})

server.listen({
    host: '0.0.0.0',
    port: process.env.port ?? 3000,
})