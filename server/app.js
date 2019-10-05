const express = require('express');
const ForgeSDK = require('forge-apis');
const cookieSession = require('cookie-session')
const app = express();
const port = 3000;

const AUTODESK_CLIENT_ID = process.env.AUTODESK_CLIENT_ID
const AUTODESK_CLIENT_SECRET = process.env.AUTODESK_CLIENT_SECRET
const AUTODESK_REDIRECT_URL = process.env.AUTODESK_REDIRECT_URL

app.use(cookieSession({
    name: 'session',
    keys: "blah",
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.get('/', (req, res) => {res.send("Hello")})

app.get('/auth/signin', (req, res) => {
    var autoRefresh = true;
    res.redirect(302, oauthClient().generateAuthUrl());
})

app.get('/auth/callback', (req, res) => {
    req.query.code
    oauthClient().getToken(req.query.code).then( (credentials) => {

        const UserApi = new ForgeSDK.UserProfileApi();

        UserApi.getUserProfile(oauthClient(), credentials).then( (profile) => {
            console.log("----------")
            console.log(profile);
            res.send("hello again!");
        }).catch(e => {
            console.error(e);
            res.send("error pulling profile");
        });
    }).catch(e => {
        console.error(e);
        res.send("login failed");
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function oauthClient() {
    return new ForgeSDK.AuthClientThreeLegged(
        AUTODESK_CLIENT_ID,
        AUTODESK_CLIENT_SECRET,
        AUTODESK_REDIRECT_URL,
        [
            'data:read'
        ],
        true);
}
