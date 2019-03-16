import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';

type Props = RouteComponentProps & {};

const LOCALSTORAGE_TOKEN_FIELD = 'auth_token';

export function Logout(props: Props) {

  useEffect(() => {

    window.localStorage.removeItem(LOCALSTORAGE_TOKEN_FIELD);
    window.location.href = '/';

    return () => null;

  }, []);

  return null;

}