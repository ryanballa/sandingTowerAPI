import sanity from './lib/sanity.js';
import { add, format, toDate } from 'date-fns';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import express from 'express';
import dotenv from 'dotenv'
dotenv.config()

const app = express();

const checkJwt = !process.env.INTERNAL ? jwt({
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
    audience: `${process.env.AUDIENCE}`,
    issuer: `https://login.locomotivehouse.com/`,
    algorithms: ['RS256']
}) : (req, resp, next) => { next() };

app.use(bodyParser.json());
app.use(cors({ origin: ['http://localhost:5000', 'https://locomotivehouse.com'], allowedHeaders: ['Content-Type', 'Authorization'] }));

app.get('/api/user/:email', checkJwt, async function (req, res) {
    const email = req.params.email;
    const query = `*[_type == 'user' && email == '${email}']{ _id, name, email, membership[]->{ _id, name }, "profiles": *[ _type == "profile" && references(^._id)] }`;
    let usersReq = [];
    try {
        usersReq = await sanity.fetch(query);
    } catch (e) {
        console.log(`Error: ${e}`);
    }
    res.status(200).json(usersReq[0]);
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

app.get('/api/users/:clubId', checkJwt, async function (req, res) {
    const clubId = req.params.clubId;
    const query = `*[_type == 'user' && membership[]._ref == '${clubId}']{ _id, name }`;
    let usersReq = [];
    try {
        usersReq = await sanity.fetch(query);
    } catch (e) {
        console.log(`Error: ${e}`);
    }
    res.status(200).json(usersReq);
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

app.delete('/api/locomotives/:locomotiveId', checkJwt, async function (req, res) {
    const locomotiveId = req.params.locomotiveId;
    let locomotveRes = [];
    try {
        locomotveRes = await sanity.delete(locomotiveId);
    } catch (e) {
        console.log(e);
    }
    res.status(200).json(locomotveRes.results[0]);
});

app.get('/api/cabs/:clubId', checkJwt, async function (req, res) {
    const clubId = req.params.clubId;
    const query = `*[_type == 'cabs' && owner._ref in *[_type=="user" && membership[]._ref == '${clubId}']._id]{ _id, number, "cabOwner": owner->{name,_id} }`;
    let cabsQuery = [];
    try {
        cabsQuery = await sanity.fetch(query);
    } catch (e) {
        cabsQuery = e;
    }
    res.status(200).json(cabsQuery);
});

app.post('/api/cab', checkJwt, async function (req, res) {
    const doc = req.body;
    let cabRes = null;
    try {
        cabRes = await sanity.create(doc);
    } catch (e) {
        console.log(e);
    }
    res.status(200).json(cabRes);
});

app.delete('/api/cabs/:cabId', checkJwt, async function (req, res) {
    const cabId = req.params.cabId;
    let cabRes = [];
    try {
        cabRes = await sanity.delete(cabId);
    } catch (e) {
        console.log(e);
    }
    res.status(200).json(cabRes.results[0]);
});

app.get('/api/consists/:clubId', checkJwt, async function (req, res) {
    const clubId = req.params.clubId;
    const query = `*[_type == 'concists' && owner._ref in *[_type=="user" && membership[]._ref == '${clubId}']._id]{ _id, _updatedAt, number, locomotiveAddresses, "concistOwner": owner->{name,_id} }`;
    let consistsQuery = [];
    try {
        consistsQuery = await sanity.fetch(query);
    } catch (e) {
        consistsQuery = e;
    }
    res.status(200).json(consistsQuery);
});

app.post('/api/consist', checkJwt, async function (req, res) {
    const doc = req.body;
    let concistRes = null;
    try {
        concistRes = await sanity.create(doc);
    } catch (e) {
        console.log(e);
    }
    res.status(200).json(concistRes);
});

app.delete('/api/consists/:consistId', checkJwt, async function (req, res) {
    const consistId = req.params.consistId;
    let consistRes = [];
    try {
        consistRes = await sanity.delete(consistId);
    } catch (e) {
        console.log(e);
    }
    res.status(200).json(consistRes.results[0]);
});

app.get('/api/schedule/:clubId', checkJwt, async function (req, res) {
    const clubId = req.params.clubId;
    const query = `*[_type == 'schedule' && owner._ref in *[_type=="user" && membership[]._ref == '${clubId}']._id]{ _id, date, notes, "membership": membership->name, "owner": owner->{name, _id} }`;
    let scheduleQuery = [];
    try {
        scheduleQuery = await sanity.fetch(query);
    } catch (e) {
        scheduleQuery = e;
    }
    res.status(200).json(scheduleQuery);
});

app.get('/api/schedule/:clubId/users/:date', checkJwt, async function (req, res) {
    // TODO: Use clubId
    const clubId = req.params.clubId;
    const addingDateFormat = toDate(
        new Date(req.params.date),
    );;
    const addedDate = add(new Date(addingDateFormat), { hours: 24 });
    const subtractedDate = add(new Date(addingDateFormat), { hours: -24 });
    const usersOnDateQuery = `*[_type == 'schedule' && date > '${format(
        new Date(subtractedDate),
        'yyyy-MM-dd',
    )}' && date < '${format(
        new Date(addedDate),
        'yyyy-MM-dd',
    )}']{ _id, date, "membership": membership->name, "owner": owner->{name, _id} }`;
    let usersOnAddingDateRes = null;
    try {
        usersOnAddingDateRes = await sanity.fetch(usersOnDateQuery);
    } catch (e) {
        usersOnAddingDateRes = e;
    }
    res.status(200).json(usersOnAddingDateRes);
});

app.post('/api/schedule', checkJwt, async function (req, res) {
    const doc = req.body;
    let scheduleRes = null;
    try {
        scheduleRes = await sanity.create(doc);
    } catch (e) {
        console.log(e);
    }
    res.status(200).json(scheduleRes);
});

app.delete('/api/schedule/:scheduleId', checkJwt, async function (req, res) {
    const scheduleId = req.params.scheduleId;
    let scheduleRes = [];
    try {
        scheduleRes = await sanity.delete(scheduleId);
    } catch (e) {
        console.log(e);
    }
    res.status(200).json(scheduleRes.results[0]);
});

app.post('/api/profile', checkJwt, async function (req, res) {
    const doc = req.body;
    let profileRes = null;
    if (doc._id) {
        try {
            profileRes = await sanity.patch(doc._id).set({
                bio: doc.bio,
                fontSize: doc.fontSize,
                timePreference: doc.timePreference,
            }).commit();
        } catch (e) {
            console.log(e);
        }
    } else {
        try {
            profileRes = await sanity.create(doc);
        } catch (e) {
            console.log(e);
        }
    }
    res.status(200).json(profileRes);
});

app.get('/api/changelog', async function (req, res) {
    const query = `*[_type == 'changelog']{ _id, _updatedAt, description }`;
    let scheduleQuery = [];
    try {
        scheduleQuery = await sanity.fetch(query);
    } catch (e) {
        scheduleQuery = e;
    }
    res.status(200).json(scheduleQuery);
});

app.get('/api/towers/:clubId', async function (req, res) {
    const clubId = req.params.clubId;
    const query = `*[_type == 'tower' && membership._ref == '${clubId}']{ _id, description, name, maintainer->{name, _id}, membership->{name, _id} }`;
    let scheduleQuery = [];
    try {
        scheduleQuery = await sanity.fetch(query);
    } catch (e) {
        scheduleQuery = e;
    }
    res.status(200).json(scheduleQuery);
});

app.get('/api/issues/:clubId', async function (req, res) {
    const clubId = req.params.clubId;
    const query = `*[_type == 'issue' && membership._ref in *[_type=="tower" && membership._ref == '${clubId}']._id]{_id, name, description, urgency, status, membership->{_id}, responder[]->{name, _id} }`;
    let scheduleQuery = [];
    try {
        scheduleQuery = await sanity.fetch(query);
    } catch (e) {
        scheduleQuery = e;
    }
    res.status(200).json(scheduleQuery);
});

app.listen(process.env.PORT || 4000)
