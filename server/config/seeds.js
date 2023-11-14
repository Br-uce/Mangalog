const db = require('./connection');
const { Manga, Review, User } = require('../models');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
    await cleanDB('Manga', 'mangas');
    await cleanDB('User', 'users');

    // Begin seeding of Manga
    // Due to the setup of pre-seeding, the avg Rating and reviewCounts are added in manually.
    const mangas = await Manga.insertMany([
        {title: 'Test Manga 1', description: 'Short test description here.', avgRating: 3.5, reviewCount: 2},
        {title: 'Test Manga 2', description: 'Shorter test description.', avgRating: 4, reviewCount: 1},
        {title: 'Test Manga 3', avgRating: 3, reviewCount: 1},
    ]);
    console.log('Manga seeded.');

    // Begin seeding of Users
    await User.create({
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
    });
    await User.create({
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
    });
    console.log('Users Seeded.');

    process.exit();
})