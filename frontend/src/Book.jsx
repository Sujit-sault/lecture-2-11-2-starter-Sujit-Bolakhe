// frontend/src/Book.jsx
import { useState } from 'react';

function Book({ id, title, author, price, onDelete, onUpdate }) {
    // 1. Local state for "Edit Mode"
    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(title);
    const [tempAuthor, setTempAuthor] = useState(author);
    const [tempPrice, setTempPrice] = useState(price);

    // 2. Handle Save
    const handleSave = () => {
        const updatedBook = {
            id,
            title: tempTitle,
            author: tempAuthor,
            price: parseFloat(tempPrice),
            copies: 1 // For now, keep copies static or add an input for it
        };

        onUpdate(id, updatedBook); // Call the parent function
        setIsEditing(false);       // Exit edit mode
    };

    // 3. Conditional Rendering: EDIT MODE
    if (isEditing) {
        return (
            <div className="book-row editing" style={{ border: '2px solid #4444ff', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', backgroundColor: '#eef' }}>
                <input type="text" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} style={{ flex: 2 }} />
                <input type="text" value={tempAuthor} onChange={(e) => setTempAuthor(e.target.value)} style={{ flex: 1 }} />
                <input type="number" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} style={{ width: '80px' }} />

                <button onClick={handleSave} style={{ backgroundColor: '#28a745', color: 'white' }}>Save</button>
                <button onClick={() => setIsEditing(false)} style={{ backgroundColor: '#6c757d', color: 'white' }}>Cancel</button>
            </div>
        );
    }

    // 4. Conditional Rendering: VIEW MODE
    return (
        <div className="book-row" style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
            <div className="book-info" style={{ textAlign: 'left' }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{title}</h3>
                <p style={{ margin: '0' }}>
                    <strong>Author:</strong> {author} | <strong>Price:</strong> ${price.toFixed(2)}
                </p>
            </div>

            <div className="book-actions">
                <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#ffc107', marginRight: '5px' }}>Edit</button>
                <button onClick={() => onDelete(id)} style={{ backgroundColor: '#ff4444', color: 'white' }}>Delete</button>
            </div>
        </div>
    );
}

export default Book;

