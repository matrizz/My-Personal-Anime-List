//@ts-nocheck

import fastify from 'fastify'
import cors from '@fastify/cors'
import prisma, { type Anime } from '../lib/prisma.ts';
import type { ListStatus } from '@prisma/client';

// process.on("uncaughtException", (err) => {
//     console.error("Exceção não capturada:", err);
// });

// process.on("unhandledRejection", (reason) => {
//     console.error("Promise rejeitada não tratada:", reason);
// });

const api = fastify()

await api.register(cors, {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
});

api.get('/health', () => 'OK')

api.get('/user', async (req, res) => {
    const { username, avatar } = (await prisma.user.findMany())[0]

    return res.send({ username, avatar })
})

api.get('/animes/:id', async (req, res) => {
    const { id } = req.params

    try {
        return res.send(await prisma.anime.findUnique({ where: { mal_id: parseInt(id) } }))
    } catch (err) {
        console.error(err)
    }

})

api.post('/animes', async (req, res) => {
    const data = JSON.parse(req.body)

    const anime: Anime = data.anime
    const listType: ListStatus = data.listType
    const user = (await prisma.user.findMany())[0]
    try {
        await prisma.anime.upsert({
            where: { mal_id: anime.mal_id },
            update: {},
            create: {
                status: listType,
                episodes: anime.episodes,
                mal_id: anime.mal_id,
                synopsis: anime.synopsis,
                title: anime.title,
                type: anime.type,
                rank: anime.rank,
                score: anime.score,
                season: anime.season,
                year: anime.year,
                title_english: anime.title_english,
                title_japanese: anime.title_japanese,
                images: {
                    jpg: {
                        ...anime.images.jpg
                    },
                    webp: {
                        ...anime.images.webp
                    }
                },
                genres: anime.genres || [],
            },
        });

    } catch (err) {
        console.error(err)
    }
})

api.get('/animes', async (req, res) => {
    const animes = await prisma.anime.findMany()

    return res.send(animes)
})

api.put('/animes', async (req, res) => {
    const { animeId, fromList, toList } = JSON.parse(req.body)

    try {

        await prisma.anime.update({
            where: {
                mal_id: animeId,
                status: fromList
            },
            data: {
                status: toList
            }
        })

    } catch (err) {
        console.error(err)
    }
})

api.delete('/animes', async (req, res) => {
    const { listType, animeId } = JSON.parse(req.body)

    try {
        await prisma.anime.delete({
            where: {
                mal_id: animeId,
                status: listType
            }
        })
    } catch (err) {
        console.error(err)
    }
})

api.put('/user', async (req, res) => {
    const { username, avatar } = JSON.parse(req.body)

    try {
        const user = (await prisma.user.findMany())[0]

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                username,
                avatar
            }
        })

    } catch (err) {
        console.error(err)
    }
})

api.listen({ port: 4000 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    try {
        createDefaultUser()
    } catch (err) {
        console.error(err)
    }
    console.log(`Server listening at ${address}`)
})

async function createDefaultUser() {
    const user = (await prisma.user.findMany())[0]

    if (!user) {
        try {
            await prisma.user.create({
                data: {
                    username: "admin"
                }
            })
        } catch (err) {
            console.error(err)
        }
    }
}