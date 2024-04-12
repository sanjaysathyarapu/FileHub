export const oktaAuthConfig = {
    issuer: 'https://dev-bg71n6gttk2gpyju.us.auth0.com/oauth2/default',
    clientId: 'm5mKIMBiRTcZv1WlCtH23hQGVh8WqRPb',
    redirectUri: window.location.origin + '/login/callback'
    // redirectUri: 'http://localhost:3000/login/callback',
    // scopes: ['openid', 'profile', 'email']
};