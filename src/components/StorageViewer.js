import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

function StorageViewer() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStorageItems = async () => {
            try {
                const listRef = ref(storage, '');
                const res = await listAll(listRef);

                // Combine folders and files into a single array
                const allItems = [
                    ...res.prefixes.map(folderRef => ({ name: folderRef.name, type: 'folder' })),
                    ...await Promise.all(
                        res.items.map(async (itemRef) => {
                            const url = await getDownloadURL(itemRef);
                            return { name: itemRef.name, type: 'file', url };
                        })
                    )
                ];

                setItems(allItems);
            } catch (err) {
                setError(`Failed to fetch items: ${err.message}`);
                console.error('Error fetching items:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStorageItems();
    }, []);

    if (loading) return <p>Loading items...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Firebase Storage Structure</h2>
            <ul>
                {items.map(item => (
                    <li key={item.name}>
                        {item.type === 'folder' ? (
                            <strong>{item.name}/</strong>
                        ) : (
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                {item.name}
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StorageViewer;
