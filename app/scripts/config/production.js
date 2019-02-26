'use strict';

export default {
  environment: 'production',
  api: 'https://nethope-sitrep-api.herokuapp.com',
  authDomain: 'nethope-sitrep.auth0.com'
  authClientID: process.env['AUTH_CLIENT_ID'],
  authRedirectUri: process.env['AUTH_REDIRECT_URI']
};
