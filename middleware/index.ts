import * as samlify from 'samlify';
import * as fs from 'fs';
import * as validator from '@authenio/samlify-node-xmllint';

const binding = samlify.Constants.namespace.binding;

samlify.setSchemaValidator(validator);

// configure okta idp

const idp = (idp, encrypted) => {

  if (idp === 'okta') {

    if (encrypted) {
      return samlify.IdentityProvider({
          metadata: fs.readFileSync(__dirname + '/../metadata/okta-enc.xml'),
          isAssertionEncrypted: true,
          messageSigningOrder: 'encrypt-then-sign',
          wantLogoutRequestSigned: true,
      });
    }
    
    return samlify.IdentityProvider({
      metadata: fs.readFileSync(__dirname + '/../metadata/okta.xml'),
      wantLogoutRequestSigned: true
    });

  }

  if (idp === 'openam') {

    return samlify.IdentityProvider({
      metadata: fs.readFileSync(__dirname + '/../metadata/openam.xml'),
      isAssertionEncrypted: false
    });

  }

  throw new Error('Unsupported IdP');

}

// configure our service provider (your application)
const sp = (idp) => samlify.ServiceProvider({
  entityID: 'http://localhost:8080/metadata',
  authnRequestsSigned: false,
  wantAssertionsSigned: true,
  wantMessageSigned: true,
  wantLogoutResponseSigned: true,
  wantLogoutRequestSigned: true,
  privateKey: fs.readFileSync(__dirname + '/../key/sign/privkey.pem'),
  privateKeyPass: 'VHOSp5RUiBcrsjrcAuXFwU1NKCkGA8px',
  isAssertionEncrypted: false,
  assertionConsumerService: [{
    Binding: binding.post,
    Location: `http://localhost:8080/sp/acs?idp=${idp}`,
  }]
});

// encrypted response
const spEnc = (idp) => samlify.ServiceProvider({
  entityID: 'http://localhost:8080/metadata?encrypted=true',
  authnRequestsSigned: false,
  wantAssertionsSigned: true,
  wantMessageSigned: true,
  wantLogoutResponseSigned: true,
  wantLogoutRequestSigned: true,
  privateKey: fs.readFileSync(__dirname + '/../key/sign/privkey.pem'),
  privateKeyPass: 'VHOSp5RUiBcrsjrcAuXFwU1NKCkGA8px',
  encPrivateKey: fs.readFileSync(__dirname + '/../key/encrypt/privkey.pem'),
  assertionConsumerService: [{
    Binding: binding.post,
    Location: `http://localhost:8080/sp/acs?encrypted=true&idp=${idp}`,
  }]
});

export const assignEntity = (req, _res, next) => {

  if (req.query && req.query.idp) {
    req.idp = idp(req.query.idp, req.query.encrypted);
    req.sp = sp(req.query.idp);
  }

  return next();
};