export const makeHeaders = (
  { contentType = 'application/json', ...restHeaders } = {},
  { skipContentType = false } = {},
) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { ...restHeaders };

  if (!skipContentType) headers['Content-Type'] = contentType;
  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');

  return token ? { Authorization: `Bearer ${token}` } : { Authorization: '' };
};
