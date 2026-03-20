export default registerAuthConfig('auth', () => ({
  port: process.env.AUTH_PORT || 8000,
  host: process.env.AUTH_HOST || 'localhost',
  session_resolve_endpoint:
    process.env.AUTH_SESSION_RESOLVE_ENDPOINT || '/api/v1/resolve',
}));
function registerAuthConfig(
  key: string,
  configFactory: () => {
    port: string | number;
    host: string;
    session_resolve_endpoint: string;
  },
) {
  return {
    [key]: configFactory(),
  };
}
