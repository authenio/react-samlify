import * as samlify from 'samlify';
import * as fs from 'fs';

const binding = samlify.Constants.namespace.binding;

export default function server(app) {

  // configure okta idp
  const oktaIdp = samlify.IdentityProvider({
    metadata: fs.readFileSync('./metadata/okta.xml')
  });

  // configure our service provider (your application)
  const sp = samlify.ServiceProvider({
    authnRequestsSigned: true,
    wantAssertionsSigned: true,
    wantMessageSigned: true,
    wantLogoutResponseSigned: true,
    wantLogoutRequestSigned: true,
    privateKey: fs.readFileSync('./key/privkey.pem'),
    privateKeyPass: 'VHOSp5RUiBcrsjrcAuXFwU1NKCkGA8px',
    isAssertionEncrypted: false,
    assertionConsumerService: [{
      Binding: binding.post,
      Location: 'http://localhost:8080/sp/acs',
    }]
  });

  // assertion consumer service endpoint (post-binding)
  app.post('/sp/acs', (req, res) => {
    // create a session to the application
  });

  // call to init a sso login with redirect binding
  app.get('/sso/redirect', (req, res) => {

  });

  // call to init a sso login with post binding
  app.get('sso/post', (req, res) => {

  });
  
}