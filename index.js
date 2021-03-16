import sanity from './lib/sanity.js';
import cors from 'cors';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import express from 'express';

const app2 = express();

const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://dev-1onipavl.us.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: '87L3BqxrCNlT2Cnqac8JQB37ybOb5l9K',
    issuer: `https://dev-1onipavl.us.auth0.com/`,
    algorithms: ['RS256']
});

app2.use(cors({ origin: ['http://localhost:5000', 'https://locomotivehouse.com'], allowedHeaders: ['Content-Type', 'Authorization'] }));

app2.get('/api/user/:email', checkJwt, async function (req, res) {
    const email = req.params.email;
    const query = `*[_type == 'user' && email == '${email}']{ _id, name, email, "profiles": *[ _type == "profile" && references(^._id)] }`;
    let usersReq = [];
    try {
        usersReq = await sanity.fetch(query);
    } catch (e) {
        console.log(`Error: ${e}`);
    }
    res.status(200).json(usersReq);
}).listen(process.env.PORT || 4000)
