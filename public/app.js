const API_URL = '/api/books';
const AUTH_URL = '/api/auth';
let currentUser = null;

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const result = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(result?.error || `Request failed (${response.status})`);
  }

  return result;
}

function getReadStatus(book) {
  return book.read ? 'Already read' : 'Want to read';
}

function makeBookCard(book) {
  const card = document.createElement('article');
  card.className = 'book-card';

  const detailsLink = document.createElement('a');
  detailsLink.className = 'book-card-link';
  detailsLink.href = `/book.html?id=${encodeURIComponent(book.id)}`;

  const title = document.createElement('h3');
  title.textContent = book.title;
  const author = document.createElement('p');
  author.className = 'book-author';
  author.textContent = `by ${book.author}`;
  const type = document.createElement('span');
  type.className = 'book-type';
  type.textContent = book.type;
  detailsLink.append(title, author, type);

  const footer = document.createElement('div');
  footer.className = 'book-card-footer';
  const status = document.createElement('span');
  status.className = 'read-status';
  status.textContent = getReadStatus(book);
  footer.append(status);
  if (currentUser) {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'text-button';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete ${book.title}`);
    deleteButton.addEventListener('click', () => deleteBook(book.id, book.title));
    footer.append(deleteButton);
  }

  card.append(detailsLink, footer);
  return card;
}

async function loadBooks() {
  const list = document.querySelector('#book-list');
  if (!list) return;

  const count = document.querySelector('#book-count');
  const message = document.querySelector('#gallery-message');

  try {
    const books = await requestJson(API_URL);
    list.replaceChildren();
    count.textContent = `${books.length} ${books.length === 1 ? 'book' : 'books'}`;

    if (books.length === 0) {
      message.textContent = 'Your shelf is ready for its first book.';
      return;
    }

    message.textContent = '';
    books.forEach((book) => list.append(makeBookCard(book)));
  } catch (error) {
    count.textContent = 'Unavailable';
    message.textContent = `Could not load your books: ${error.message}`;
    message.classList.add('notice-error');
  }
}

async function deleteBook(id, title) {
  if (!window.confirm(`Delete "${title}" from your shelf?`)) {
    return;
  }

  const message = document.querySelector('#gallery-message');
  try {
    await requestJson(`${API_URL}/${encodeURIComponent(id)}`, { method: 'DELETE' });
    await loadBooks();
    message.classList.remove('notice-error');
    message.textContent = `"${title}" was deleted.`;
  } catch (error) {
    message.textContent = `Could not delete the book: ${error.message}`;
    message.classList.add('notice-error');
  }
}

function setupCreateForm() {
  const form = document.querySelector('#create-book-form');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.querySelector('#form-message');
    const fields = new FormData(form);
    const book = {
      title: fields.get('title').trim(),
      author: fields.get('author').trim(),
      type: fields.get('type').trim(),
      read: fields.get('read') === 'true'
    };

    try {
      await requestJson(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      });
      form.reset();
      message.classList.remove('notice-error');
      message.textContent = 'Book added to your shelf.';
      await loadBooks();
    } catch (error) {
      message.textContent = `Could not add the book: ${error.message}`;
      message.classList.add('notice-error');
    }
  });
}

function updateAuthUi() {
  const authPanel = document.querySelector('#auth-panel');
  const signedInPanel = document.querySelector('#signed-in-panel');
  const createBookSection = document.querySelector('#create-book-section');
  const accountMessage = document.querySelector('#account-message');
  const detailDeleteButton = document.querySelector('#delete-book');

  if (authPanel) authPanel.hidden = Boolean(currentUser);
  if (signedInPanel) signedInPanel.hidden = !currentUser;
  if (createBookSection) createBookSection.hidden = !currentUser;
  if (detailDeleteButton) detailDeleteButton.hidden = !currentUser;
  if (currentUser && accountMessage) {
    accountMessage.textContent = `Logged in as ${currentUser.username}.`;
  }
}

async function initializeAuth() {
  const message = document.querySelector('#auth-message');
  try {
    const result = await requestJson(`${AUTH_URL}/me`);
    currentUser = result.user;
    if (message) {
      message.textContent = '';
      message.classList.remove('notice-error');
    }
  } catch (error) {
    currentUser = null;
    if (message) {
      message.textContent = `Could not check your login status: ${error.message}`;
      message.classList.add('notice-error');
    }
  }
  updateAuthUi();
}

function setupAuthForms() {
  for (const [formId, endpoint] of [['login-form', 'login'], ['signup-form', 'signup']]) {
    const form = document.querySelector(`#${formId}`);
    if (!form) continue;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const message = document.querySelector('#auth-message');
      const fields = new FormData(form);
      try {
        await requestJson(`${AUTH_URL}/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: fields.get('username'),
            password: fields.get('password')
          })
        });
        form.reset();
        await initializeAuth();
        await loadBooks();
        message.classList.remove('notice-error');
        message.textContent = endpoint === 'signup' ? 'Your account was created.' : 'You are logged in.';
      } catch (error) {
        message.textContent = `Could not ${endpoint === 'signup' ? 'sign up' : 'log in'}: ${error.message}`;
        message.classList.add('notice-error');
      }
    });
  }

  const logoutButton = document.querySelector('#logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      const message = document.querySelector('#auth-message');
      try {
        await requestJson(`${AUTH_URL}/logout`, { method: 'POST' });
        await initializeAuth();
        await loadBooks();
        message.textContent = 'You are logged out.';
      } catch (error) {
        message.textContent = `Could not log out: ${error.message}`;
        message.classList.add('notice-error');
      }
    });
  }
}

async function setupBookDetails() {
  const form = document.querySelector('#edit-book-form');
  if (!form) return;

  const message = document.querySelector('#detail-message');
  const heading = document.querySelector('#detail-heading');
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) {
    heading.textContent = 'Book not found';
    message.textContent = 'Choose a book from your shelf to see its details.';
    return;
  }

  const url = `${API_URL}/${encodeURIComponent(id)}`;
  let book;
  try {
    book = await requestJson(url);
  } catch (error) {
    heading.textContent = 'Could not load book';
    message.textContent = error.message;
    message.classList.add('notice-error');
    return;
  }

  document.title = `${book.title} | Book Nook`;
  heading.textContent = book.title;
  form.elements.title.value = book.title;
  form.elements.author.value = book.author;
  form.elements.type.value = book.type;
  form.elements.read.value = String(Boolean(book.read));
  form.hidden = !currentUser;
  if (!currentUser) {
    message.textContent = 'Log in from the library page to edit this book.';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = new FormData(form);
    const updatedBook = {
      title: fields.get('title').trim(),
      author: fields.get('author').trim(),
      type: fields.get('type').trim(),
      read: fields.get('read') === 'true'
    };

    try {
      book = await requestJson(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBook)
      });
      heading.textContent = book.title;
      document.title = `${book.title} | Book Nook`;
      message.classList.remove('notice-error');
      message.textContent = 'Your changes have been saved.';
    } catch (error) {
      message.textContent = `Could not save your changes: ${error.message}`;
      message.classList.add('notice-error');
    }
  });

  document.querySelector('#delete-book').addEventListener('click', async () => {
    if (!window.confirm(`Delete "${book.title}" from your shelf?`)) {
      return;
    }

    try {
      await requestJson(url, { method: 'DELETE' });
      window.location.assign('/');
    } catch (error) {
      message.textContent = `Could not delete the book: ${error.message}`;
      message.classList.add('notice-error');
    }
  });
}

async function startApp() {
  await initializeAuth();
  setupAuthForms();
  setupCreateForm();
  await loadBooks();
  await setupBookDetails();
}

startApp();
