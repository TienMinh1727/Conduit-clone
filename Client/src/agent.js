const API_ROOT =
  process.env.REACT_APP_BACKEND_URL ?? 'https://conduit.productionready.io/api';

function serialize(object) {
  const params = [];

  for (const param in object) {
    if (Object.hasOwnProperty.call(object, param) && object[param] != null) {
      params.push(`${param}=${encodeURIComponent(object[param])}`);
    }
  }

  return params.join('&');
}

let token = null;

const agent = async (url, body, method = 'GET') => {
  const headers = new Headers();

  if (body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Token ${token}`);
  }

  const response = await fetch(`${API_ROOT}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let result;

  try {
    result = await response.json();
  } catch (error) {
    result = { errors: { [response.status]: [response.statusText] } };
  }

  if (!response.ok) throw result;

  return result;
};

const requests = {
  get: (url, query = {}) => {
    if (Number.isSafeInteger(query?.page)) {
      query.limit = query.limit ? query.limit : 10;
      query.offset = query.page * query.limit;
    }
    delete query.page;
    const isEmptyQuery = query == null || Object.keys(query).length === 0;

    return agent(isEmptyQuery ? url : `${url}?${serialize(query)}`);
  },

  put: (url, body) => agent(url, body, 'PUT'),

  post: (url, body) => agent(url, body, 'POST'),
};

const Auth = {
  current: () => requests.get('/user'),

  login: (email, password) =>
    requests.post('/users/login', { user: { email, password } }),

  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),

  save: (user) => requests.put('/user', { user }),
};

const Tags = {
  getAll: () => requests.get('/tags'),
};

const Articles = {
  all: (query) => requests.get(`/articles`, query),

  byAuthor: (author, page) =>
    requests.get(`/articles`, { author, limit: 5, page }),

  byTag: (tag, page) => requests.get(`/articles`, { tag, page }),

  del: (slug) => requests.del(`/articles/${slug}`),

  favorite: (slug) => requests.post(`/articles/${slug}/favorite`),

  favoritedBy: (username, page) =>
    requests.get(`/articles`, { favorited: username, limit: 5, page }),

  feed: (page) => requests.get('/articles/feed', { page }),

  get: (slug) => requests.get(`/articles/${slug}`),

  unfavorite: (slug) => requests.del(`/articles/${slug}/favorite`),

  update: ({ slug, ...article }) =>
    requests.put(`/articles/${slug}`, { article }),

  create: (article) => requests.post('/articles', { article }),
};

const Comments = {
  create: (slug, comment) =>
    requests.post(`/articles/${slug}/comments`, { comment }),

  delete: (slug, commentId) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),

  forArticle: (slug) => requests.get(`/articles/${slug}/comments`),
};

const Profile = {
  follow: (username) => requests.post(`/profiles/${username}/follow`),

  get: (username) => requests.get(`/profiles/${username}`),

  unfollow: (username) => requests.del(`/profiles/${username}/follow`),
};

export default {
  Articles,
  Auth,
  Comments,
  Profile,
  Tags,
  setToken: (_token) => {
    token = _token;
  },
};
