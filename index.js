import sanity from './lib/sanity.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import express from 'express';

const app = express();

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

app.use(bodyParser.json());
app.use(cors({ origin: ['http://localhost:5000', 'https://locomotivehouse.com'], allowedHeaders: ['Content-Type', 'Authorization'] }));

app.get('/api/user/:email', checkJwt, async function (req, res) {
    const email = req.params.email;
    const query = `*[_type == 'user' && email == '${email}']{ _id, name, email, "profiles": *[ _type == "profile" && references(^._id)] }`;
    let usersReq = [];
    try {
        usersReq = await sanity.fetch(query);
    } catch (e) {
        console.log(`Error: ${e}`);
    }
    res.status(200).json(usersReq);
});

app.post('/api/user', checkJwt, async function (req, res) {
    const doc = req.body;
    let userRes = null;
    try {
        userRes = await sanity.create(doc);
    } catch (e) {
        console.log(e);
    }
    res.status(200).json(userRes);
});

app.get('/api/clubs', async function (req, res) {
    const query = `*[_type == 'club']{ _id, name }`;
    let usersReq = [];
    try {
        usersReq = await sanity.fetch(query);
    } catch (e) {
        console.log(`Error: ${e}`);
    }
    res.status(200).json(usersReq);
});

app.get('/api/locomotives', checkJwt, async function (req, res) {
    const query = `*[_type == 'locomotive']{ _id, address, engineType, road, roadNumber, "locomotiveOwner": owner->{_id, name} }`;
    let locomotivesQuery = [];
    try {
        locomotivesQuery = await sanity.fetch(query);
    } catch (e) {
        locomotivesQuery = e;
    }
    res.status(200).json(locomotivesQuery);
});

app.post('/api/locomotives', checkJwt, async function (req, res) {
    const doc = req.body;
    let locomotveRes = null;
    try {
        locomotveRes = await sanity.create(doc);
    } catch (e) {
        console.log(e);
    }
    res.status(200).json(locomotveRes);
});

app.listen(process.env.PORT || 4000)
