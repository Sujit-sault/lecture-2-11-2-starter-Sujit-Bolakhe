// frontend/src/MagazineForm.jsx
import { useState } from 'react';

function MagazineForm({ onMagazineAdded }) {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [copies, setCopies] = useState(1);
    const[orderQty, setOrderQty] = useState(10);
    const [currentIssue, setCurrentIssue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Safely format date so it always has seconds (e.g., 2026-03-03T15:25:00)
        let finalIssue = currentIssue;
        if (finalIssue && finalIssue.length === 16) {
            finalIssue += ":00";
        }

        const newMagazine = {
            title,
            price: parseFloat(price || 0),
            copies: parseInt(copies || 0),
            orderQty: parseInt(orderQty || 0),
            currentIssue: finalIssue
        };

        fetch('/api/rest/magazines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMagazine),
        })
            .then(response => {
                // Check if the backend rejected the request (e.g., 400 Bad Request)
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(savedMagazine => {
                alert("Magazine Saved!");
                onMagazineAdded(savedMagazine); // Only add if successful
                // Clear the form
                setTitle('');
                setPrice('');
                setCopies(1);
                setOrderQty(10);
                setCurrentIssue('');
            })
            .catch(err => {
                console.error(err);
                alert("Failed to save magazine: Check inputs and try again.");
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '2px solid purple', padding: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3>Add New Magazine</h3>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type="number" step="0.01" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <div style={{ display: 'flex', gap: '10px' }}>
                <label>Copies: <input type="number" value={copies} onChange={(e) => setCopies(e.target.value)} required style={{width: '60px'}} /></label>
                <label>Order Qty: <input type="number" value={orderQty} onChange={(e) => setOrderQty(e.target.value)} required style={{width: '60px'}} /></label>
            </div>
            <label>Current Issue:
                <input type="datetime-local" value={currentIssue} onChange={(e) => setCurrentIssue(e.target.value)} required style={{marginLeft: '10px'}} />
            </label>
            <button type="submit" style={{backgroundColor: 'purple', color: 'white', marginTop: '10px'}}>Save Magazine</button>
        </form>
    );
}

export default MagazineForm;