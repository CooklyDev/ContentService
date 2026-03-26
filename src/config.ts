export default registerAuthConfig('auth', () => {
  const port = process.env.AUTH_PORT;
  const host = process.env.AUTH_HOST;
  const session_resolve_endpoint = process.env.AUTH_SESSION_RESOLVE_ENDPOINT;

  if (!port) {
    throw new Error('AUTH_PORT is required');
  }
  if (!host) {
    throw new Error('AUTH_HOST is required');
  }
  if (!session_resolve_endpoint) {
    throw new Error('AUTH_SESSION_RESOLVE_ENDPOINT is required');
  }

  return {
    port,
    host,
    session_resolve_endpoint,
  };
});
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
