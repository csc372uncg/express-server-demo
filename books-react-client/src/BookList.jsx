import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './books.css'

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [bookType, setBookType] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [typeInput, setTypeInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      const url = `${import.meta.env.VITE_API_URL}/api/books?type=${bookType}&author=${bookAuthor}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data);
    };
    fetchBooks();
  }, [bookType, bookAuthor]);

  return (
    <div id="book-list">
      <h1>Book List</h1>
      <label>Type:</label>
      <input type="text" placeholder="Type..." value={typeInput} onChange={(e) => setTypeInput(e.target.value)} />
      <label>Author:</label>
      <input type="text" placeholder="Author..." value={authorInput} onChange={(e) => setAuthorInput(e.target.value)} />
      <button type="button" onClick={() => { setBookType(typeInput); setBookAuthor(authorInput); }}>Search</button>
      <button type="button" onClick={() => { setBookType(''); setBookAuthor(''); setTypeInput(''); setAuthorInput(''); }}>Clear</button>
      {books.map(book => (
        <article className='book-article' key={book.id}>
          <p>Title: {book.title}</p>
          <p>Author: {book.author}</p>
          <Link to={`/books/${book.id}`}>View Details</Link>
          <hr />
        </article>
      ))}
      {(!books || books.length === 0) && <p>No books found.</p>}
      <Link to="/books/new">Add New Book</Link>
    </div>
  );
};

export default BookList;