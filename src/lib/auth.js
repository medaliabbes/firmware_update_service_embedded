import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { createAuth0Client } from '@auth0/auth0-spa-js';
import { writable } from 'svelte/store';

const domain = env.PUBLIC_AUTH0_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/+$/, '');
const clientId = env.PUBLIC_AUTH0_CLIENT_ID;
const audience = env.PUBLIC_AUTH0_AUDIENCE;
const callbackPath = '/auth/callback';

/** @typedef {{ isLoading: boolean, isAuthenticated: boolean, user: { email?: string } | null, error: string | null }} AuthState */

/** @type {import('svelte/store').Writable<AuthState>} */
export const authState = writable(/** @type {AuthState} */ ({
  isLoading: true,
  isAuthenticated: false,
  user: null,
  error: null
}));

/** @type {Promise<Awaited<ReturnType<typeof createAuth0Client>> | null> | null} */
let authClientPromise = null;

function authorizationParams(extra = {}) {
  return {
    redirect_uri: `${window.location.origin}${callbackPath}`,
    audience,
    ...extra
  };
}


export async function initializeAuth() {
  if (!browser) return null;

  if (!domain || !clientId || !audience) {
    authState.set({
      isLoading: false,
      isAuthenticated: false,
      user: null,
      error: 'Set PUBLIC_AUTH0_DOMAIN, PUBLIC_AUTH0_CLIENT_ID, and PUBLIC_AUTH0_AUDIENCE in the frontend .env.'
    });
    return null;
  }

  if (!authClientPromise) {
    authClientPromise = (async () => {
      const client = await createAuth0Client({
        domain,
        clientId,
        authorizationParams: authorizationParams(),
        useRefreshTokens: true,
        cacheLocation: 'localstorage'
      });

      if (window.location.pathname === callbackPath && window.location.search) {
        await client.handleRedirectCallback();
        window.history.replaceState(
          window.history.state,
          document.title,
          callbackPath
        );
      }

      const isAuthenticated = await client.isAuthenticated();
      const user = isAuthenticated ? (await client.getUser()) ?? null : null;
      authState.set({ isLoading: false, isAuthenticated, user, error: null });
      return client;
    })().catch((error) => {
      authState.set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: error.message || 'Unable to initialize Auth0.'
      });
      return null;
    });
  }

  return authClientPromise;
}

export async function login() {
  const client = await initializeAuth();
  if (!client) return;
  await client.loginWithRedirect({ authorizationParams: authorizationParams() });
}

export async function signUp() {
  const client = await initializeAuth();
  if (!client) return;
  await client.loginWithRedirect({
    authorizationParams: authorizationParams({ screen_hint: 'signup' })
  });
}

export async function logout() {
  const client = await initializeAuth();
  if (!client) return;
  await client.logout({ logoutParams: { returnTo: window.location.origin } });
}

export async function getAccessToken() {
  const client = await initializeAuth();
  if (!client) throw new Error('Auth0 is not configured.');

  try {
    return await client.getTokenSilently({ authorizationParams: { audience } });
  } catch (error) {
    const errorCode = typeof error === 'object' && error !== null && 'error' in error
      ? error.error
      : undefined;
    if (typeof errorCode === 'string' && ['login_required', 'consent_required', 'interaction_required'].includes(errorCode)) {
      await login();
      throw new Error('Redirecting to Auth0 login.');
    }
    throw error;
  }
}