// import { App } from '@tinyhttp/app'
// import sanity from './lib/sanity.js';
// import { cors } from '@tinyhttp/cors'
// import { logger } from '@tinyhttp/logger'
// import bodyParser from 'body-parser'

// const app = new App({
//     onError: (err, req, res) => {
//         res.status(500).send({
//             message: err.message,
//         })
//     },
// })

// app
//     .use(cors({ origin: 'http://localhost:5000', allowedHeaders: ['Content-Type'] }))
//     .use(logger())
//     .use(bodyParser.json())
//     .get('/api/user/:email', async (req, res) => {
//         const query = `*[_type == 'user' && email == '${req.params.email}']{ _id, name, email, "userProfile":userProfile->{bio,timePreference} }`;
//         let usersReq = [];
//         try {
//             usersReq = await sanity.fetch(query);
//         } catch (e) {
//             usersReq = e;
//         }
//         res.status(200).send(JSON.stringify(usersReq));
//     })

// module.exports = app;
// module.exports.handler = serverless(app);