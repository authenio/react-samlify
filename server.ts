import * as samlify from 'samlify';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import { getUser, createToken, verifyToken } from './services/auth';

const binding = samlify.Constants.namespace.binding;

export default function server(app) {

  app.use(bodyParser.urlencoded({ extended: false }));
  // for pretty print debugging
  app.set('json spaces', 2);

  // configure okta idp
  const oktaIdp = samlify.IdentityProvider({
    metadata: fs.readFileSync('./metadata/okta.xml')
  });

  // configure our service provider (your application)
  const sp = samlify.ServiceProvider({
    entityID: 'http://localhost:8080/metadata',
    authnRequestsSigned: false,
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
  app.post('/sp/acs', async (req, res) => {
    try {
      const { extract } = await sp.parseLoginResponse(oktaIdp, 'post', req);
      const { login } = extract.attributes;
      // get your system user
      const payload = getUser(login);
      if (payload) {
        // create session and redirect to the session page
        const token = createToken(payload);
        return res.redirect(`/?auth_token=${token}`);
      }
      throw new Error('ERR_USER_NOT_FOUND');
    } catch (e) {
      return res.redirect('/');
    }
  });

  // call to init a sso login with redirect binding
  app.get('/sso/redirect', (req, res) => {
    const { id, context: redirectUrl } = sp.createLoginRequest(oktaIdp, 'redirect'); 
    return res.redirect(redirectUrl);
  });

  // distribute the metadata
  app.get('/metadata', (req, res) => {
    res.header('Content-Type', 'text/xml').send(sp.getMetadata());
  });

  // get user profile
  app.get('/profile', (req, res) => {
    try {
      const bearer = req.headers.authorization.replace('Bearer ', '');
      const { verified, payload } = verifyToken(bearer)
      if (verified) {
        return res.json({ profile: payload });
      }
      return res.send(401);
    } catch (e) {
      res.send(401);
    }
  });
  
}