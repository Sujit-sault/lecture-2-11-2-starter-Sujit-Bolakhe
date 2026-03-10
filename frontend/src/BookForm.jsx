import { useState } from 'react';

function BookForm({ onBookAdded }) {
    // 1. Define state for each input field
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState(0);
    const [copies, setCopies] = useState(1);

    // 2. The Submit Handler
    const handleSubmit = (e) => {
        e.preventDefault(); // Stop the page from reloading!

        const newBook = { title, author, price, copies };

        // 3. POST to Spring Boot
        fetch('/api/rest/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBook),
        })
            .then(response => response.json())
            .then(savedBook => {
                alert("Book Saved!");
                onBookAdded(savedBook); // Tell the parent to update the list
                // 4. Clear the form
                setTitle('');
                setAuthor('');
                setPrice(0);
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '2px solid blue', padding: '20px', marginBottom: '20px' }}>
            <h3>Add New Book</h3>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <button type="submit">Save to Database</button>
        </form>
    );
}

export default BookForm;

