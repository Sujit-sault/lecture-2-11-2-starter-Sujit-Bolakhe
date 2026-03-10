// frontend/src/Magazine.jsx
import { useState } from 'react';

function Magazine({ id, title, price, copies, orderQty, currentIssue, onDelete, onUpdate }) {
    const formatIssueDate = (issue) => {
        if (!issue) return '';
        if (typeof issue === 'string') return issue.slice(0, 16);
        if (Array.isArray(issue)) {
            const[y, m, d, h = 0, min = 0] = issue;
            return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        }
        return '';
    };

    const displayIssue = formatIssueDate(currentIssue);

    const [isEditing, setIsEditing] = useState(false);
    const[tempTitle, setTempTitle] = useState(title);
    const [tempPrice, setTempPrice] = useState(price);
    const [tempCopies, setTempCopies] = useState(copies);
    const[tempOrderQty, setTempOrderQty] = useState(orderQty);
    const [tempIssue, setTempIssue] = useState(displayIssue);

    const handleSave = () => {
        let finalIssue = tempIssue;
        if (finalIssue && finalIssue.length === 16) {
            finalIssue += ":00";
        }

        const updatedMagazine = {
            id,
            title: tempTitle,
            price: parseFloat(tempPrice || 0),
            copies: parseInt(tempCopies || 0),
            orderQty: parseInt(tempOrderQty || 0),
            currentIssue: finalIssue
        };

        onUpdate(id, updatedMagazine);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="book-row editing" style={{ border: '2px solid #4444ff', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', backgroundColor: '#eef', flexWrap: 'wrap' }}>
                <input type="text" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} style={{ flex: '1 1 100%' }} />
                <input type="number" step="0.01" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} title="Price" style={{ width: '80px' }} />
                <input type="number" value={tempCopies} onChange={(e) => setTempCopies(e.target.value)} title="Copies" style={{ width: '80px' }} />
                <input type="number" value={tempOrderQty} onChange={(e) => setTempOrderQty(e.target.value)} title="Order Qty" style={{ width: '80px' }} />
                <input type="datetime-local" value={tempIssue} onChange={(e) => setTempIssue(e.target.value)} />

                <button onClick={handleSave} style={{ backgroundColor: '#28a745', color: 'white' }}>Save</button>
                <button onClick={() => setIsEditing(false)} style={{ backgroundColor: '#6c757d', color: 'white' }}>Cancel</button>
            </div>
        );
    }

    return (
        <div className="book-row" style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
            <div className="book-info" style={{ textAlign: 'left' }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{title}</h3>
                <p style={{ margin: '0', fontSize: '14px' }}>
                    {/* Safe number formatting applied below */}
                    <strong>Price:</strong> ${Number(price || 0).toFixed(2)} |
                    <strong> Copies:</strong> {copies} |
                    <strong> Order Qty:</strong> {orderQty} |
                    <strong> Issue:</strong> {displayIssue.replace('T', ' ')}
                </p>
            </div>

            <div className="book-actions">
                <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#ffc107', marginRight: '5px' }}>Edit</button>
                <button onClick={() => onDelete(id)} style={{ backgroundColor: '#ff4444', color: 'white' }}>Delete</button>
            </div>
        </div>
    );
}

export default Magazine;