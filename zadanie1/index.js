const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'szkola'
});

db.connect((err) => {
    if (err) {
        console.error('Błąd połączenia z bazą:', err);
    } else {
        console.log('Połączono z bazą MySQL');
    }
});

app.get('/', (req, res) => {
    res.send('Proste API z MySQL działa');
});

app.get('/api/uczniowie', (req, res) => {
    const sql = 'SELECT id, imie, nazwisko, klasa FROM uczniowie';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Błąd zapytania:', err);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }

        res.json(results);
    });
});

app.get('/api/uczniowie/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT id, imie, nazwisko, klasa FROM uczniowie WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Błąd zapytania:', err);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Uczeń nie znaleziony' });
        }

        res.json(results[0]);
    });
});

app.post('/api/uczniowie', (req, res) => {
    const { imie, nazwisko, klasa } = req.body;

    if (!imie || !nazwisko || !klasa) {
        return res.status(400).json({ error: 'Brak wymaganych pól (imie, nazwisko, klasa)' });
    }

    const sql = 'INSERT INTO uczniowie (imie, nazwisko, klasa) VALUES (?, ?, ?)';

    db.query(sql, [imie, nazwisko, klasa], (err, result) => {
        if (err) {
            console.error('Błąd zapytania:', err);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }

        res.status(201).json({
            message: 'Uczeń dodany poprawnie',
            id: result.insertId,
            imie,
            nazwisko,
            klasa
        });
    });
});

app.put('/api/uczniowie/:id', (req, res) => {
    const id = req.params.id;
    const { imie, nazwisko, klasa } = req.body;

    if (!imie || !nazwisko || !klasa) {
        return res.status(400).json({ error: 'Brak wymaganych pól (imie, nazwisko, klasa)' });
    }

    const sql = `
        UPDATE uczniowie
        SET imie = ?, nazwisko = ?, klasa = ?
        WHERE id = ?
    `;

    db.query(sql, [imie, nazwisko, klasa, id], (err, result) => {
        if (err) {
            console.error('Błąd zapytania:', err);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Uczeń o podanym ID nie istnieje' });
        }

        res.json({
            message: 'Uczeń zaktualizowany poprawnie',
            id,
            imie,
            nazwisko,
            klasa
        });
    });
});

app.delete('/api/uczniowie/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM uczniowie WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Błąd zapytania:', err);
            return res.status(500).json({ error: 'Błąd bazy danych'});
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'Uczeń o pdanym ID nie istnieje'});
        }

        res.json({
            message: 'uczeń został usunięty',
            id
        });
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});