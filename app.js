var express = require('express');
require('dotenv').config();
var bodyParser = require('body-parser')
var sendinblue = require('sib-api-v3-sdk');

const client = sendinblue.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.MAIL_KEY
//live account
const stripe = require('stripe')('sk_test_51MjxP2LeU4WXdoCCCNkKoMJivNaQREjrqk2Z8f2fHTIiOXOG54P1ALTJNU0YACgZrvqXzbQVnhR7alnHUqGnWpmH00eO5WzjNX');

//test account
// const stripe = require('stripe')('sk_test_51MqtAFSDMmpWcTBEt7PDTvSDh72mJDueqpidAOhwpjJK30ATKFq8C4bzs2VaXW6tKoMOV3dwRuySunQcRlb2gMGh00DqYEXmbb');
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

app.listen(3002, function () { console.log('running'); });

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

        const { email, country, currency, phone, city, state, address_line1, address_line2, post_code, firstname, lastname, dob_day, dob_month, dob_year } = req.body;

        if (!email) {
            res.status(500).json({
                status: false,
                data: "User mail id is required",
            });
        }
        // if (!iban) {
        //     res.status(500).json({
        //         status: false,
        //         data: "Iban id is required",
        //     });
        // } 
        // if (!bis) {
        //     res.status(500).json({
        //         status: false,
        //         data: "BIS is required",
        //     });
        // } 
        if (!country) {
            res.status(500).json({
                status: false,
                data: "Country is required",
            });
        }
        if (!city) {
            res.status(500).json({
                status: false,
                data: "City is required",
            });
        }
        if (!currency) {
            res.status(500).json({
                status: false,
                data: "Currency value is required",
            });
        }
        if (!phone) {
            res.status(500).json({
                status: false,
                data: "Phone number is required",
            });
        }
        if (!address_line1) {
            res.status(500).json({
                status: false,
                data: "Address Line 1 is required",
            });
        }
        if (!state) {
            res.status(500).json({
                status: false,
                data: "State is required",
            });
        }
        if (!post_code) {
            res.status(500).json({
                status: false,
                data: "Post code is required",
            });
        }
        if (!firstname) {
            res.status(500).json({
                status: false,
                data: "Firstname is required",
            });
        }
        if (!lastname) {
            res.status(500).json({
                status: false,
                data: "Lastname is required",
            });
        }
        if (!dob_day) {
            res.status(500).json({
                status: false,
                data: "Date of Birth day is required",
            });
        }
        if (!dob_month) {
            res.status(500).json({
                status: false,
                data: "Date of Birth month is required",
            });
        }
        if (!dob_year) {
            res.status(500).json({
                status: false,
                data: "Date of Birth year is required",
            });
        }
        var param = {
            type: 'custom',
            country: country,
            default_currency: currency,
            email: email,
            business_type: 'individual',
            individual: {
                address: { city: city, country: country, line1: address_line1, line2: address_line2, state: state, postal_code: post_code },
                dob: { day: dob_day, month: dob_month, year: dob_year },
                email: email,
                phone: phone,
                first_name: firstname,
                last_name: lastname
            },
            business_profile: {
                mcc: 7399,
                product_description: 'Tangle group (activity) creation with payment for activity ticket payment for the creator',
                support_phone: phone,
                support_url: 'https://www.tangleoffline.com/',
                url: 'https://www.tangleoffline.com/',
            },
            capabilities: {
                card_payments: {
                    requested: true
                },
                transfers: {
                    requested: true
                }
            },
            tos_acceptance: {
                "date": Math.floor(Date.now() / 1000),
                "ip": req.ip
            }
        };

        try {

            stripe.accounts.create(param, function (err, account) {
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

        var param = {}; business_profile = {};

        if (typeof req.body.email !== 'undefined') {
            param.email = req.body.email;
        }
        // if (typeof req.body.country !== 'undefined') {
        //     param.country = req.body.country;
        // }
        // if (typeof req.body.currency !== 'undefined') {
        //     param.default_currency = req.body.currency;
        // }
        // if (typeof req.body.iban !== 'undefined') {
        //     param.pmetadataaram.iban = req.body.iban;
        // }
        // if (typeof req.body.bis !== 'undefined') {
        //     param.metadata.bis = req.body.bis;
        // }
        if (typeof req.body.phone !== 'undefined') {
            business_profile.support_phone = req.body.phone;
        }


        if (business_profile) {
            param.business_profile = business_profile;
        }
        try {
            console.log(param);
            stripe.accounts.update(req.params.id, param, function (err, account) {

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


app.post('/bank_account', (req, res) => {

    if (!Object.keys(req.body).length) {
        res.status(500).json({
            status: false,
            data: 'User details missing',
        });
    } else {

        const { connect_ac_id, iban, bis, country, currency, account_number, account_holder_name } = req.body;

        if (!connect_ac_id) {
            res.status(500).json({
                status: false,
                data: "User account id is required",
            });
        }
        if (!iban) {
            res.status(500).json({
                status: false,
                data: "Iban id is required",
            });
        }
        if (!bis) {
            res.status(500).json({
                status: false,
                data: "BIS is required",
            });
        }
        if (!country) {
            res.status(500).json({
                status: false,
                data: "COuntry is required",
            });
        }
        if (!currency) {
            res.status(500).json({
                status: false,
                data: "Currency value is required",
            });
        }
        if (!account_number) {
            res.status(500).json({
                status: false,
                data: "Account number is required",
            });
        }
        if (!account_holder_name) {
            res.status(500).json({
                status: false,
                data: "Account holder name is required",
            });
        }

        var param = {
            external_account: {
                object: 'bank_account',
                country: country,
                currency: currency,
                account_holder_name: account_holder_name,
                account_holder_type: 'individual',
                account_number: account_number
            },
            metadata: {
                iban: iban,
                bis: bis,
            },

        };

        try {

            stripe.accounts.createExternalAccount(connect_ac_id, param, function (err, account) {
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
                data: "Failed to create account",
            });
        }

    }
});



app.get('/bank_accounts/:id', (req, res) => {

    if (req.params.id.search('acct_') == -1) {
        res.status(500).json({
            status: false,
            data: "Invalid account details",
        });
    }

    try {
        stripe.accounts.listExternalAccounts(req.params.id, { object: 'bank_account' }, function (err, account) {
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
            data: "Failed to retrieve user bank details",
        });
    }
});


app.delete('/bank_account', (req, res) => {

    if (!req.body.connect_ac_id) {
        res.status(500).json({
            status: false,
            data: "Invalid account details",
        });
    }
    if (!req.body.account_id) {
        res.status(500).json({
            status: false,
            data: "Account ID is required",
        });
    }
    if (req.body.connect_ac_id.search('acct_') == -1) {
        res.status(500).json({
            status: false,
            data: "Invalid account details",
        });
    }

    try {
        stripe.accounts.deleteExternalAccount(req.body.connect_ac_id, req.body.account_id, function (err, account) {
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
            data: "Failed to delete user bank details",
        });
    }
});




app.post('/create_card', (req, res) => {

    if (!Object.keys(req.body).length) {
        res.status(500).json({
            status: false,
            data: 'User details missing',
        });
    } else {

        const { connect_ac_id, iban, bis, currency, card_number, account_holder_name, exp_month, exp_year, cvc } = req.body;

        if (!connect_ac_id) {
            res.status(500).json({
                status: false,
                data: "User account id is required",
            });
        }
        if (!iban) {
            res.status(500).json({
                status: false,
                data: "Iban id is required",
            });
        }
        if (!bis) {
            res.status(500).json({
                status: false,
                data: "BIS is required",
            });
        }
        // if (!country) {
        //     res.status(500).json({
        //         status: false,
        //         data: "COuntry is required",
        //     });
        // }
        if (!currency) {
            res.status(500).json({
                status: false,
                data: "Currency value is required",
            });
        }
        if (!card_number) {
            res.status(500).json({
                status: false,
                data: "Account number is required",
            });
        } if (!exp_month) {
            res.status(500).json({
                status: false,
                data: "Expiry month is required",
            });
        } if (!exp_year) {
            res.status(500).json({
                status: false,
                data: "Expiry year is required",
            });
        }
        if (!account_holder_name) {
            res.status(500).json({
                status: false,
                data: "Account holder name is required",
            });
        }
        if (!cvc) {
            res.status(500).json({
                status: false,
                data: "CVC is required",
            });
        }


        // var param = {
        //     external_account: {
        //         object: 'card',
        //         number: card_number,
        //         exp_month: exp_month,
        //         exp_year: exp_year,
        //         currency: currency,
        //         name: account_holder_name
        //     },
        //     metadata: {
        //         iban: iban,
        //         bis: bis,
        //     },

        // };

        try {
            param = {
                card: {
                    number: card_number,
                    exp_month: exp_month,
                    exp_year: exp_year,
                    currency: currency,
                    // name: account_holder_name,
                    cvc: cvc,
                }
            };
            stripe.tokens.create(param, function (err, account) {
                if (err) {
                    res.status(500).json({
                        status: false,
                        data: err,
                    });
                } else {
                    console.log(account);
                    stripe.accounts.createExternalAccount(connect_ac_id, { external_account: account.id }, function (err, account) {
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
                }
            });

        } catch (error) {
            res.status(500).json({
                status: false,
                data: "Failed to create account",
            });
        }

        // try {

        //     stripe.accounts.createExternalAccount(connect_ac_id, param, function (err, account) {
        //         if (err) {
        //             res.status(500).json({
        //                 status: false,
        //                 data: err,
        //             });
        //         } else {
        //             res.status(200).json({
        //                 status: true,
        //                 data: account
        //             });
        //         }
        //     });

        // } catch (error) {
        //     res.status(500).json({
        //         status: false,
        //         data: "Failed to create account",
        //     });
        // }

    }
});


app.post('/payment', (req, res) => {

    if (!Object.keys(req.body).length) {
        res.status(500).json({
            status: false,
            data: 'data missing',
        });
    } else {

        const { amount, currency, destination_account } = req.body;

        if (!amount) {
            res.status(500).json({
                status: false,
                data: "Amount is required",
            });
        }
        if (!currency) {
            res.status(500).json({
                status: false,
                data: "Currency code is required",
            });
        }
        if (!destination_account) {
            res.status(500).json({
                status: false,
                data: "Account is required",
            });
        }

        var param = {
            amount: amount,
            currency: currency,
            payment_method_types: ['card'],
            transfer_data: {
                destination: destination_account,
            },

        };

        try {

            stripe.paymentIntents.create(param, function (err, account) {
                if (err) {
                    res.status(500).json({
                        status: false,
                        data: err,
                    });
                } else {
                    console.log(account);
                    res.status(200).json({
                        status: true,
                        data: account
                    });
                }
            });

        } catch (error) {
            res.status(500).json({
                status: false,
                data: "Payment intent failed",
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
