const db = require('./connection');
const { Manga, Review, User } = require('../models');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
    await cleanDB('Manga', 'mangas');
    await cleanDB('User', 'users');

    // Begin seeding of Manga
    const mangas = await Manga.insertMany([
        {title: 'Test Manga 1', description: 'Short test description here.'},
        {title: 'Test Manga 2', description: 'Shorter test description.'},
        {title: 'Test Manga 3'},
    ]);
    console.log('Manga seeded.');

    // Begin seeding of Users
    const users = await User.insertMany([
        {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'janedoe@testmail.com',
            password: 'password1234',
            reviews: [
                {
                    rating: 5,
                    description: 'Very nice story.',
                    manga: mangas[0]._id,
                },
                {
                    rating: 4,
                    manga: mangas[1]._id,
                }
            ]
        },
        {
            firstName: 'Ethan',
            lastName: 'Dowager',
            email: 'Edow@testmail.com',
            password: 'password1234',
            reviews: [
                {
                    rating: 2,
                    manga: mangas[0]._id,
                },
                {
                    rating: 3,
                    description: 'It was alright.',
                    manga: mangas[2]._id,
                }
            ]
        }
    ]);
    console.log('User Seeded.');

    process.exit();
})