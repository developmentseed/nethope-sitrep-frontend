'use strict';

export default {
  environment: 'production',

  mbtoken: 'pk.eyJ1IjoiZ28taWZyYyIsImEiOiJjams3b2ZhZWswMGFvM3hxeHp2ZHFhOTRrIn0._pqO9OQ2iNeDGrpopJNjpg',

  api: 'https://nethope-sitrep-api.herokuapp.com',
  goApi: 'https://prddsgocdnapi.azureedge.net/api/v2/',
  goRoot: 'https://go.ifrc.org/',

  siteRoot: '//devseed.com/nethope-sitrep-frontend/',

  authDomain: 'nethope-sitrep.auth0.com',
  authClientID: process.env['AUTH_CLIENT_ID'],
  authRedirectUri: process.env['AUTH_REDIRECT_URI']
};
