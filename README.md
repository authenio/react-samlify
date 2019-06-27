# react-samlify

**Disclaimer: This repository provide a minimal implementation for SAML based login with Okta identity provider. Therefore, it is not a production ready implementation especially the handling of storing token and user account. We try to keep this repository to be very simple and get you idea on how to integrate your current application with samlify, even though you only have basic knowledge on SAML-based implementation.**

We will continue to add more common identity providers in this example repository.

## Development

```console
yarn
yarn dev
```

## Credential for Okta Login

```
Username: user.passify.io@gmail.com
Password: AUvRhaudDxHHb3vuPydP
```

If you want to have your own login for testing, please send an email to passify.io@gmail.com.

## Features Completed

- [x] SP-init SSO, Okta IDP with (redirect/post) binding (Encrypted/Signed/Encrypted + Sign)
- [x] SP-init SLO, Okta IDP with (redirect/post) binding

**Remarks: If SP-initiate SSO works, IDP initiate SSO works as well.**

## Tutorial

Coming soon ...
