const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for cross-origin requests

// Establish database connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

// User registration route
app.post('/register', (req, res) => {
  const { username, password, rol, empleado_id } = req.body;

  // Hash the password using bcrypt for security
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Prepare and execute SQL query to insert new user into the database
  const query = 'INSERT INTO usuarios (username, password, rol, empleado_id) VALUES (?, ?, ?, ?)';
  db.query(query, [username, hashedPassword, rol, empleado_id], (err, results) => {
    if (err) {
      console.error('Error during registration:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.status(201).send('Usuario registrado');
  });
});

// User login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Prepare and execute SQL query to retrieve user information
  const query = 'SELECT * FROM usuarios WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).send('Error en el servidor');
    }

    // Check if user exists
    if (results.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    const user = results[0];

    // Compare provided password with hashed password using bcrypt
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Contraseña inválida');
    }

    // Generate and send JWT authentication token
    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ auth: true, token });
  });
});

// Define and start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
