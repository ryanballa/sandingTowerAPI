import { App } from '@tinyhttp/app'
import { cors } from '@tinyhttp/cors'
import { logger } from '@tinyhttp/logger'
import bodyParser from 'body-parser'
import sanity from './lib/sanity.js';

const app = new App({
    onError: (err, req, res) => {
        res.status(500).send({
            message: err.message,
        })
    },
})

app
    .use(cors({ origin: 'http://localhost:5000', allowedHeaders: ['Content-Type'] }))
    .use(logger())
    .use(bodyParser.json())
    .get('/api/user/:email', async (req, res) => {
        const email = req.params.email;
        const query = `*[_type == 'user' && email == '${email}']{ _id, name, email, "userProfile":userProfile->{bio,timePreference} }`;
        let usersReq = [];
        try {
            usersReq = await sanity.fetch(query);
        } catch (e) {
            console.log(`Error: ${e}`);
        }
        res.status(200).json(usersReq);
    })
    .listen(process.env.PORT || 5000)