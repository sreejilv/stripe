var express = require('express');
require('dotenv').config();
var bodyParser = require('body-parser')
var sendinblue = require('sib-api-v3-sdk');

const client = sendinblue.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.MAIL_KEY


const stripe = require('stripe')('sk_test_51MqtAFSDMmpWcTBEt7PDTvSDh72mJDueqpidAOhwpjJK30ATKFq8C4bzs2VaXW6tKoMOV3dwRuySunQcRlb2gMGh00DqYEXmbb');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {

    try {
        bearerHearder = req.headers['authorization']
        let bearer = bearerHearder.split(' ')
        let bearerToken = bearer[1];
        if (bearerToken == process.env.API_KEY) {
            next()
        } else {
            res.status(403).json({
                status: false,
                data: "Authentication failed",
            });
        }
    } catch (error) {
        res.status(403).json({
            status: false,
            data: "Authentication failed",
        });
    }

});

// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// Pass iban and bis number in meta data, then country NL, currency euro

app.listen(3000, function () { console.log('running'); });

app.get('/accounts', (req, res) => {
    // { limit: 3 }
    try {

        stripe.accounts.list({}, function (err, account) {
            if (err) {
                res.status(500).json({
                    status: false,
                    data: err,
                });
            } else {
                res.status(200).json({
                    status: true,
                    data: account
                });
            }
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            data: "Failed to retrieve all users",
        });
    }
});

app.get('/account/:id', (req, res) => {

    if (req.params.id.search('acct_') == -1) {
        res.status(500).json({
            status: false,
            data: "Invalid account details",
        });
    }

    try {
        stripe.accounts.retrieve(req.params.id, function (err, account) {
            if (err) {
                res.status(500).json({
                    status: false,
                    data: err,
                });
            } else {
                res.status(200).json({
                    status: true,
                    data: account
                });
            }
        });


    } catch (error) {
        res.status(500).json({
            status: false,
            data: "Failed to retrieve user details",
        });
    }
});

app.delete('/account/:id', (req, res) => {
    if (req.params.id.search('acct_') == -1) {
        res.status(500).json({
            status: false,
            data: "Invalid account details",
        });
    }
    try {
        stripe.accounts.del(req.params.id, function (err, account) {
            if (err) {
                res.status(500).json({
                    status: false,
                    data: err,
                });
            } else {
                res.status(200).json({
                    status: true,
                    data: account
                });
            }
        });


    } catch (error) {
        res.status(500).json({
            status: false,
            data: "Failed to delete user details",
        });
    }
});

app.post('/create', (req, res) => {

    if (!Object.keys(req.body).length) {
        res.status(500).json({
            status: false,
            data: 'User details missing',
        });
    } else {

        const { email, iban, bis, country, currency } = req.body;

        if (!email) {
            res.status(500).json({
                status: false,
                data: "User mail id is required",
            });
        }
        if (!iban) {
            res.status(500).json({
                status: false,
                data: "Iban id is required",
            });
        } if (!bis) {
            res.status(500).json({
                status: false,
                data: "BIS is required",
            });
        } if (!country) {
            res.status(500).json({
                status: false,
                data: "COuntry is required",
            });
        } if (!currency) {
            res.status(500).json({
                status: false,
                data: "Currency value is required",
            });
        }
        var param = {
            type: 'standard',
            country: country,
            default_currency: currency,
            email: email,
            metadata: {
                iban: iban,
                bis: bis,
            },
        };

        try {

            stripe.accounts.create(param, function (err, account) {
                console.log(err);
                if (err) {
                    res.status(500).json({
                        status: false,
                        data: err,
                    });
                } else {
                    res.status(200).json({
                        status: true,
                        data: account
                    });
                }
            });

        } catch (error) {
            res.status(500).json({
                status: false,
                data: "Failed to create user details",
            });
        }

    }
});



app.put('/update/:id', (req, res) => {

    if (req.params.id.search('acct_') == -1) {
        res.status(500).json({
            status: false,
            data: "Invalid account details",
        });
    }

    if (!Object.keys(req.body).length) {
        res.status(500).json({
            status: false,
            data: 'User details missing',
        });
    } else {

        var param = {};

        if (typeof req.body.email !== 'undefined') {
            param.email = req.body.email;
        }
        if (typeof req.body.iban !== 'undefined') {
            param.metadata.iban = req.body.iban;
        }
        if (typeof req.body.bis !== 'undefined') {
            param.metadata.bis = req.body.bis;
        }
        if (typeof req.body.country !== 'undefined') {
            param.country = req.body.country;
        }
        if (typeof req.body.currency !== 'undefined') {
            param.default_currency = req.body.currency;
        }


        try {

            stripe.accounts.update(req.params.id, param, function (err, account) {
                console.log(err);
                if (err) {
                    res.status(500).json({
                        status: false,
                        data: err,
                    });
                } else {
                    res.status(200).json({
                        status: true,
                        data: account
                    });
                }
            });

        } catch (error) {
            res.status(500).json({
                status: false,
                data: "Failed to create user details",
            });
        }

    }
});


app.post('/send_mail', (req, res) => {

    if (!Object.keys(req.body).length) {

        res.status(500).json({
            status: false,
            data: 'Datas missing',
        });

    } else {
        const { email, otp } = req.body;
        if (!email && !otp) {
            res.status(500).json({
                status: false,
                data: "Insufficiant details",
            });
        }
        const tranEmailApi = new sendinblue.TransactionalEmailsApi()
        const sender = {
            email: 'team@tangleoffline.com',
            name: 'Tangle offline',
        }
        const receivers = [
            { email: email },
        ]

        tranEmailApi
            .sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Tangle student verification',
                textContent: `
            Hi,
            Your student verification code is {{params.role}}
        `,
                htmlContent: `
            Hi,
            Your student verification code is {{params.role}}
                `,
                params: {
                    role: otp,
                },
            })
            .then(res.status(200).json({
                status: true,
                data: 'mail send'
            }))
            .catch(res.status(500).json({
                status: false,
                data: "Failed to send mail",
            }))
    }
});
