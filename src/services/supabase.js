import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const missingEnvError = new Error(
  'Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
);

const disabledResult = { data: null, error: missingEnvError };
const disabledPromise = Promise.resolve(disabledResult);

const createThenableProxy = (overrides = {}) =>
  new Proxy(
    {},
    {
      get: (_, property) => {
        if (property === 'then') {
          return disabledPromise.then.bind(disabledPromise);
        }

        if (property === 'catch') {
          return disabledPromise.catch.bind(disabledPromise);
        }

        if (property === 'finally') {
          return disabledPromise.finally.bind(disabledPromise);
        }

        if (property in overrides) {
          return overrides[property];
        }

        return (..._args) => createThenableProxy(overrides);
      },
    }
  );

const createDisabledAuth = () =>
  new Proxy(
    {},
    {
      get: (_, property) => {
        if (property === 'then') {
          return disabledPromise.then.bind(disabledPromise);
        }

        if (property === 'catch') {
          return disabledPromise.catch.bind(disabledPromise);
        }

        if (property === 'finally') {
          return disabledPromise.finally.bind(disabledPromise);
        }

        return (..._args) => disabledPromise;
      },
    }
  );

const createDisabledStorageBucket = () => createThenableProxy();

const createDisabledStorage = () =>
  new Proxy(
    {},
    {
      get: (_, property) => {
        if (property === 'from') {
          return () => createDisabledStorageBucket();
        }

        if (property === 'then') {
          return disabledPromise.then.bind(disabledPromise);
        }

        if (property === 'catch') {
          return disabledPromise.catch.bind(disabledPromise);
        }

        if (property === 'finally') {
          return disabledPromise.finally.bind(disabledPromise);
        }

        return (..._args) => disabledPromise;
      },
    }
  );

const createDisabledClient = () =>
  new Proxy(
    {},
    {
      get: (_, property) => {
        if (property === 'from' || property === 'rpc' || property === 'channel') {
          return () => createThenableProxy();
        }

        if (property === 'auth') {
          return createDisabledAuth();
        }

        if (property === 'storage') {
          return createDisabledStorage();
        }

        if (property === 'then') {
          return disabledPromise.then.bind(disabledPromise);
        }

        if (property === 'catch') {
          return disabledPromise.catch.bind(disabledPromise);
        }

        if (property === 'finally') {
          return disabledPromise.finally.bind(disabledPromise);
        }

        return (..._args) => createDisabledClient();
      },
    }
  );

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(missingEnvError.message);
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createDisabledClient();

export default supabase;
