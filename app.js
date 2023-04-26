var express = require('express');
const stripe = require('stripe')('sk_test_51MqtAFSDMmpWcTBEt7PDTvSDh72mJDueqpidAOhwpjJK30ATKFq8C4bzs2VaXW6tKoMOV3dwRuySunQcRlb2gMGh00DqYEXmbb');
var app = express();

app.listen(3000,function(){ console.log('running');});
var createConnect = function(){
    var param={
    type: 'standard',
    country: 'IN',
    email: 'jenny.rosen@example.com',
    // capabilities: {
    //   card_payments: {requested: true},
    //   transfers: {requested: true},
    // }
};

    // const account = await stripe.accounts.create(param);
    stripe.accounts.create(param,function(err, account){
        if(err){
            console.log(err);
        }else if(account){
            console.log(account);
        }else{
            console.log(account)
        }

    });

   
}
createConnect();

// {
//     id: 'acct_1N0aY6SDEjR1nezM',
//     object: 'account',
//     business_profile: {
//       mcc: null,
//       name: null,
//       product_description: null,
//       support_address: null,
//       support_email: null,
//       support_phone: null,
//       support_url: null,
//       url: null
//     },
//     business_type: null,
//     capabilities: {},
//     charges_enabled: false,
//     controller: { is_controller: true, type: 'application' },
//     country: 'IN',
//     created: 1682385610,
//     default_currency: 'inr',
//     details_submitted: false,
//     email: 'jenny.rosen@example.com',
//     external_accounts: {
//       object: 'list',
//       data: [],
//       has_more: false,
//       total_count: 0,
//       url: '/v1/accounts/acct_1N0aY6SDEjR1nezM/external_accounts'
//     },
//     future_requirements: {
//       alternatives: [],
//       current_deadline: null,
//       currently_due: [],
//       disabled_reason: null,
//       errors: [],
//       eventually_due: [],
//       past_due: [],
//       pending_verification: []
//     },
//     metadata: {},
//     payouts_enabled: false,
//     requirements: {
//       alternatives: [],
//       current_deadline: null,
//       currently_due: [
//         'business_profile.product_description',
//         'business_profile.support_phone',
//         'business_profile.url',
//         'external_account',
//         'tos_acceptance.date',
//         'tos_acceptance.ip'
//       ],
//       disabled_reason: 'requirements.past_due',
//       errors: [],
//       eventually_due: [
//         'business_profile.product_description',
//         'business_profile.support_phone',
//         'business_profile.url',
//         'external_account',
//         'tos_acceptance.date',
//         'tos_acceptance.ip'
//       ],
//       past_due: [ 'external_account', 'tos_acceptance.date', 'tos_acceptance.ip' ],
//       pending_verification: []
//     },
//     settings: {
//       bacs_debit_payments: {},
//       branding: {
//         icon: null,
//         logo: null,
//         primary_color: null,
//         secondary_color: null
//       },
//       card_issuing: { tos_acceptance: [Object] },
//       card_payments: {
//         decline_on: [Object],
//         statement_descriptor_prefix: null,
//         statement_descriptor_prefix_kana: null,
//         statement_descriptor_prefix_kanji: null
//       },
//       dashboard: { display_name: null, timezone: 'Etc/UTC' },
//       payments: {
//         statement_descriptor: null,
//         statement_descriptor_kana: null,
//         statement_descriptor_kanji: null
//       },
//       payouts: {
//         debit_negative_balances: true,
//         schedule: [Object],
//         statement_descriptor: null
//       },
//       sepa_debit_payments: {}
//     },
//     tos_acceptance: { date: null, ip: null, user_agent: null },
//     type: 'standard'
//   }



var retriveCustomer= function(){
    stripe.accounts.retrieve('acct_1N0aSpSD9oc6ZSWn',function(err, account){
        if(err){
            console.log(err);
        }else if(account){
            console.log(account);
        }else{
            console.log(account)
        }

    });
}

var deleteCustomer= function(){
    stripe.accounts.del('acct_1N0aSpSD9oc6ZSWn',function(err, account){
        if(err){
            console.log(err);
        }else if(account){
            console.log(account);
        }else{
            console.log(account)
        }

    });
}

var retriveCustomer= function(){
    stripe.accounts.list({limit:3},function(err, account){
        if(err){
            console.log(err);
        }else if(account){
            console.log(account);
        }else{
            console.log(account)
        }

    });
}
// retriveCustomer();