'use client';

import { useState } from 'react';
import {
    GetBooksDocument, GetBooksQuery,
    useCreateBookMutation,
    useDeleteBookMutation,
    useGetBooksQuery,
    useUpdateBookMutation
} from '@/generated/graphql';


const Books = () => {

  const { data, loading, error ,refetch } = useGetBooksQuery();
  const [updateBook] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();
  // const [createBook] = useCreateBookMutation();
    const [createBook] = useCreateBookMutation({
        update(cache, { data }) {
            if (!data?.createBook) return;
            const existingBooks = cache.readQuery<GetBooksQuery>({ query: GetBooksDocument })?.books ?? [];
            cache.writeQuery({
                query: GetBooksDocument,
                data: { books: [...existingBooks, data.createBook] },
            });
        },
    });



    const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateAuthor, setUpdateAuthor] = useState('');

  const [message, setMessage] = useState('');

  const handleCreateBook = async () => {

    if (newTitle || newAuthor) {
      try {
        await createBook({ variables: { title: newTitle, author: newAuthor } });
        setMessage('Book added successfully!');
        setNewTitle('');
        setNewAuthor('');
        // await refetch();
      } catch (err: Error|unknown) {
        setMessage('Failed to add book.');
        console.log(err)
      }
    }
  };

  const handleUpdateBook = async (id:string) => {
    if (updateTitle || updateAuthor) {
      try {
        await updateBook({ variables: { id, title: updateTitle, author: updateAuthor } });
        setMessage('Book updated successfully!');
        setUpdateTitle('');
        setUpdateAuthor('');
        await refetch();
      } catch (err: Error|unknown) {
        setMessage('Failed to update book.');
        console.log(err)
      }
    }
  };


  const handleDeleteBook = async (id:string) => {
    try {
      await deleteBook({ variables: { id } });
      setMessage('Book deleted successfully!');
        await refetch();
    } catch (err: Error|unknown) {
      setMessage('Failed to delete book.');
      console.log(err)
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Add New Book</h2>
      <input
        type="text"
        placeholder="Book Title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Book Author"
        value={newAuthor}
        onChange={(e) => setNewAuthor(e.target.value)}
      />
      <button onClick={handleCreateBook}>Add Book</button>

      <h2>Update Book</h2>
      <input
        type="text"
        placeholder="New Title"
        value={updateTitle}
        onChange={(e) => setUpdateTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="New Author"
        value={updateAuthor}
        onChange={(e) => setUpdateAuthor(e.target.value)}
      />

      {message && <p>{message}</p>}

      <h2>Books List</h2>
      <ul>
        {
        data?.books &&
          data.books.map((book) => {
              if(book)
              return (
                  <li key={book.id}>
                      {book.title} by {book.author}{' '}
                      <button onClick={() => handleUpdateBook(book.id)}>Update</button>{' '}
                      <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
                  </li>
              )
            })
          }
      </ul>
    </div>
  );
};

export default function Home() {
  return (
    <div>
      <h1>Books</h1>
      <Books />
    </div>
  );
}
