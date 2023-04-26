var express = require('express');
require('dotenv').config();
var bodyParser = require('body-parser')
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
            data: req.body,
        });
    } else {


        const { email } = req.body;
        if (!email) {
            res.status(500).json({
                status: false,
                data: "User mail id is required",
            });
        }
        var param = {
            type: 'standard',
            country: 'IN',
            email: email
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



// createConnect();

// var retriveCustomer = function () {
//     stripe.accounts.retrieve('acct_1N0aSpSD9oc6ZSWn', function (err, account) {
//         if (err) {
//             console.log(err);
//         } else if (account) {
//             console.log(account);
//         } else {
//             console.log(account)
//         }

//     });
// }

// var deleteCustomer = function () {
//     stripe.accounts.del('acct_1N0aSpSD9oc6ZSWn', function (err, account) {
//         if (err) {
//             console.log(err);
//         } else if (account) {
//             console.log(account);
//         } else {
//             console.log(account)
//         }

//     });
// }

// var retriveCustomer = function () {
//     stripe.accounts.list({ limit: 3 }, function (err, account) {
//         if (err) {
//             console.log(err);
//         } else if (account) {
//             console.log(account);
//         } else {
//             console.log(account)
//         }

//     });
// }
// retriveCustomer();