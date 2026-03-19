import { useState } from 'react';

function Ticket({ id, description, price, onDelete, onUpdate, onAddToCart, isAdmin }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempDescription, setTempDescription] = useState(description);
    const [tempPrice, setTempPrice] = useState(price);

    const handleSave = () => {
        const updatedTicket = {
            id,
            description: tempDescription,
            price: parseFloat(tempPrice)
        };
        onUpdate(id, updatedTicket);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="book-row editing">
                <input
                    type="text"
                    value={tempDescription}
                    onChange={(e) => setTempDescription(e.target.value)}
                    style={{flex: 2}}
                />
                <input
                    type="number"
                    step="0.01"
                    value={tempPrice}
                    onChange={(e) => setTempPrice(e.target.value)}
                />
                <button onClick={handleSave} className="btn-save">Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
        );
    }

    return (
        <div className="book-row">
            <div className="book-info">
                <h3>{description}</h3>
                <p><strong>Price:</strong> ${Number(price).toFixed(2)}</p>
            </div>
            <div className="book-actions">
                <button onClick={() => onAddToCart(id)} style={{ backgroundColor: '#28a745', color: 'white' }}>
                    🛒 Add to Cart
                </button>
                {/* Only show Edit/Delete if user is Admin */}
                {isAdmin && (
                    <>
                        <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#ffc107' }}>Edit</button>
                        <button onClick={() => onDelete(id)} style={{ backgroundColor: '#ff4444', color: 'white' }}>Delete</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Ticket;