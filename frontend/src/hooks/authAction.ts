//Utilities
import { read, remove, store } from '../utils/localStorage';
import {
  VCJTOKEN
  , EXPIRATION_DATE
} from '../utils/constants';
import {
  loginEndPoint
  , signUpEndPoint
  , resetPassword
  , requestPassword
  , confirmEndPoint
} from '../utils/apiEndpoint';
import {
  AUTH_SUCCESS
  , AUTH_FAILED
  , AUTH_LOGOUT
  , AUTH_LOADING
} from '../utils/actionTypes';
//Auth's actions and states
import {
  AuthState
  , AuthAction
} from '../hooks/reducer.auth';

const AuthSuccess = (
  playload: { isAuthenticated: boolean, redirect: string, isConfirmed: boolean },
  dispatch: React.Dispatch<AuthAction>
) => {
  dispatch({
    type: AUTH_SUCCESS,
    payload: playload,
  });
};

const AuthFail = (
  payload: { helperText: string; isErrorAt: string },
  dispatch: React.Dispatch<AuthAction>
) => {
  dispatch({
    type: AUTH_FAILED,
    payload: payload,
  });
};

/**
 * Function: useAuth
 * Description:
 *
 * Input:
 * 1)
 * Output:
 */
export const useAuth = () => {
  /**
   * Function: Logout
   * Description:
   *
   * Input:
   * 1) AuthDispatch
   * Output:
   */
  async function Logout(dispatch: React.Dispatch<AuthAction>) {
    //Remove user token when out of date
    remove(VCJTOKEN);
    remove(EXPIRATION_DATE);
    dispatch({
      type: AUTH_LOGOUT,
      payload: false,
    });
  }

  /**
   * Function: CheckAuthTimeout
   * Description:
   *
   * Input:
   * 1) Timeout
   * 2) AuthDispatch
   * Output:
   */
  async function CheckAuthTimeout(
    expirationTime: number,
    dispatch: React.Dispatch<AuthAction>
  ) {
    return () => {
      setTimeout(() => {
        Logout(dispatch);
      }, expirationTime * 1000);
    };
  }

  /**
   * Function: AuthLogin
   * Description:
   *
   * Input:
   * 1) AuthDispatch
   * 2) Data
   * Output:
   */
  async function AuthLogin(
    dispatch: React.Dispatch<AuthAction>,
    data: AuthState
  ) {
    try {
      fetch(loginEndPoint, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw res;
        })
        .then((res) => {
          const token = res.key;
          const expirationDate = String(
            new Date(new Date().getTime() + 3600 * 1000)
          );
          store(VCJTOKEN, token);
          store(EXPIRATION_DATE, expirationDate);
          let isConfirmed = false;   // = res.data.isConfirmed
          AuthSuccess({ isAuthenticated: true, redirect: data.redirect, isConfirmed: isConfirmed }, dispatch);
          CheckAuthTimeout(3600, dispatch);
        })
        .catch((err) => {
          dispatch({
            type: AUTH_FAILED,
            payload: {
              helperText: '????ng nh???p kh??ng th??nh c??ng, vui l??ng ki???m tra l???i th??ng tin ????ng nh???p.',
              isErrorAt: 'somewhere',
            },
          });
        });
    } catch (error) {
      dispatch({
        type: AUTH_FAILED,
        payload: {
          helperText: 'Vui l??ng ki???m tra l???i k???t n???i m???ng ho???c th??? l???i sau.',
          isErrorAt: 'somewhere',
        },
      });
    }
  }

  /**
   * Function: AuthSignup
   * Description:
   *
   * Input:
   * 1) AuthDispatch
   * 2) Data
   * Output:
   */
  async function AuthSignup(
    dispatch: React.Dispatch<AuthAction>,
    data: AuthState
  ) {
    try {
      fetch(signUpEndPoint, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw res;
        })
        .then((res) => {
          if (res.status === 'ok') {
            const token = res.data.token;
            const expirationDate = String(
              new Date(new Date().getTime() + 3600 * 1000)
            );
            store(VCJTOKEN, token);
            store(EXPIRATION_DATE, expirationDate);
            AuthSuccess(
              {
                isAuthenticated: true
                , redirect: '/account/profile'
                , isConfirmed: false
              },
              dispatch
            );
            CheckAuthTimeout(3600, dispatch);
          } else {
            if (res.message.email !== undefined) {
              const payload = {
                helperText: 'Vui l??ng th??? v???i m???t ?????a ch??? email kh??c.',
                isErrorAt: 'email',
              };
              AuthFail(payload, dispatch);
            }
            if (res.message.username !== undefined) {
              const payload = {
                helperText: 'Vui l??ng th??? v???i m???t t??n ????ng nh???p kh??c.',
                isErrorAt: 'username',
              };
              AuthFail(payload, dispatch);
            }
          }
        })
        .catch((err) => {
          dispatch({
            type: AUTH_FAILED,
            payload: {
              helperText: 'Vui l??ng ki???m tra l???i k???t n???i m???ng ho???c th??? l???i sau.',
              isErrorAt: 'somewhere',
            },
          });
        });
    } catch (error) {
      const payload = {
        helperText: error,
        isErrorAt: 'somewhere',
      };
      AuthFail(payload, dispatch);
    }
  }

  /**
   * Function: AuthRequestPassword
   * Description:
   *
   * Input:
   * 1) AuthDispatch
   * 2) Data
   * Output:
   */
  async function AuthRequestPassword(
    dispatch: React.Dispatch<AuthAction>,
    data: AuthState
  ) {
    try {
      fetch(requestPassword, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw res;
        })
        .then((res) => {
          if (res.status === 'ok') {
            const payload = {
              helperText: 'Vui l??ng ki???m h???p th?? ?????n trong email c???a b???n ????? t???o l???i m???t kh???u m???i',
              isErrorAt: 'somewhere',
            };
            AuthFail(payload, dispatch);
          } else {
            if (res.message.email !== undefined) {
              const payload = {
                helperText: res.message.email,
                isErrorAt: 'email',
              };
              AuthFail(payload, dispatch);
            }
          }
        })
        .catch((err) => {
          dispatch({
            type: AUTH_FAILED,
            payload: {
              helperText: 'Vui l??ng ki???m tra l???i k???t n???i m???ng ho???c th??? l???i sau.',
              isErrorAt: 'somewhere',
            },
          });
        });
    } catch (error) {
      dispatch({
        type: AUTH_FAILED,
        payload: {
          helperText: error,
          isErrorAt: 'somewhere',
        },
      });
    }
  }

  /**
   * Function: AuthResetPassword
   * Description:
   *
   * Input:
   * 1) AuthDispatch
   * 2) Data
   * Output:
   */
  async function AuthResetPassword(
    dispatch: React.Dispatch<AuthAction>,
    data: AuthState
  ) {
    try {
      let headers = {
        'Content-Type': 'application/json',
        'Authorization': ''
      };
      let body = {
        'username': '',
        'newPassword': '',
        'oldPassword': '',
        'code': ''
      };
      if (data.isAuthenticated) {
        let token = `Token ${read(VCJTOKEN)}`;
        headers.Authorization = token;
      }
      let url_string = window.location.href;
      let url = new URL(url_string);
      body.newPassword = data.password;
      let secretCode = url.searchParams.get('code');
      let username = url.searchParams.get('username');
      fetch(resetPassword, {
        method: 'post',
        headers: headers,
        body: JSON.stringify({
          username: username,
          oldPassword: data.oldPassword,
          newPassword: data.password,
          code: secretCode
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw res;
        })
        .then((res) => {
          if (res.status === 'ok') {
            const token = res.data.token;
            const expirationDate = String(
              new Date(new Date().getTime() + 3600 * 1000)
            );
            store(VCJTOKEN, token);
            store(EXPIRATION_DATE, expirationDate);
            AuthSuccess({ isAuthenticated: true, redirect: '/account/profile', isConfirmed: true }, dispatch);
            CheckAuthTimeout(3600, dispatch);
          } else {
            if (res.message !== undefined) {
              const payload = {
                helperText: res.message,
                isErrorAt: 'somewhere',
              };
              AuthFail(payload, dispatch);
            }
          }
        })
        .catch((err) => {
          dispatch({
            type: AUTH_FAILED,
            payload: {
              helperText: '???? c?? l???i x???y ra vui l??ng th??? l???i sau.',
              isErrorAt: 'somewhere',
            },
          });
        });
    } catch (error) {
      dispatch({
        type: AUTH_FAILED,
        payload: {
          helperText: error,
          isErrorAt: 'somewhere',
        },
      });
    }
  }

  /**
 * Function: AuthResetPassword
 * Description:
 *
 * Input:
 * 1) AuthDispatch
 * 2) Data
 * Output:
 */
  async function AccountConfirm(
    dispatch: React.Dispatch<AuthAction>,
    data: AuthState
  ) {
    try {
      let headers = {
        'Content-Type': 'application/json',
      };
      let url_string = window.location.href;
      let url = new URL(url_string);
      let secretCode = url.searchParams.get('code');
      let username = url.searchParams.get('username');
      if (username !== null && secretCode !== null) {
        dispatch({ type: AUTH_LOADING, payload: true });
        fetch(confirmEndPoint, {
          method: 'post',
          headers: headers,
          body: JSON.stringify({
            username: username,
            code: secretCode
          }),
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw res;
          })
          .then((res) => {
            if (res.status === 'ok') {
              const token = res.data.token;
              const expirationDate = String(
                new Date(new Date().getTime() + 3600 * 1000)
              );
              store(VCJTOKEN, token);
              store(EXPIRATION_DATE, expirationDate);
              AuthSuccess({ isAuthenticated: false, redirect: '', isConfirmed: true }, dispatch);
              CheckAuthTimeout(3600, dispatch);
            } else {
              if (res.message !== undefined) {
                const payload = {
                  helperText: res.message,
                  isErrorAt: 'somewhere',
                };
                AuthFail(payload, dispatch);
              }
            }
          })
          .catch((err) => {
            dispatch({
              type: AUTH_FAILED,
              payload: {
                helperText: '???? c?? l???i x???y ra vui l??ng th??? l???i sau.',
                isErrorAt: 'somewhere',
              },
            });
          });
      } else {
        dispatch({
          type: AUTH_FAILED,
          payload: {
            helperText: 'X??c th???c kh??ng ????ng!',
            isErrorAt: 'somewhere',
          },
        });
      }
    } catch (error) {
      dispatch({
        type: AUTH_FAILED,
        payload: {
          helperText: error,
          isErrorAt: 'somewhere',
        },
      });
    }
  }

  /**
   * Check the use state
   * Steps:
   * 1) Get the token
   * 2)
   */
  async function AuthCheckState(dispatch: React.Dispatch<AuthAction>, state: AuthState) {
    const token = read(VCJTOKEN);
    if (token === undefined) {
      remove(VCJTOKEN);
      remove(EXPIRATION_DATE);
    } else {
      const strExpirationDate = read(EXPIRATION_DATE);
      if (strExpirationDate !== null) {
        const expirationDate = new Date(String(strExpirationDate));
        if (expirationDate <= new Date()) {
          Logout(dispatch);
        } else {
          AuthSuccess({ isAuthenticated: true, redirect: state.redirect, isConfirmed: false }, dispatch);
          CheckAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000,
            dispatch
          );
        }
      }
    }
  }

  return {
    AuthLogin,
    Logout,
    AuthSignup,
    AuthCheckState,
    AuthResetPassword,
    AuthRequestPassword,
    AccountConfirm,
  };
};
