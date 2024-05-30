import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [rol, setRol] = useState('empleado');
    const [empleado_id, setEmpleadoId] = useState('');
    const [error, setError] = useState('');

    const handleAuth = async () => {
        const url = `http://localhost:3001${isRegister ? '/register' : '/login'}`;
        const data = isRegister ? { username, password, rol, empleado_id } : { username, password };

        try {
            const response = await axios.post(url, data);
            if (isRegister) {
                alert('Usuario registrado exitosamente');
            } else {
                alert('Inicio de sesión exitoso');
                // enviar a otra pagina
              
            }
            console.log(response.data);
            setError('');
        } catch (error) {
            console.error('Error:', error);
            setError('No se pudo conectar con el servidor');
        }
    };

    return (
        <div className="container mt-5">
            <h1>{isRegister ? 'Registro' : 'Inicio de Sesión'}</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form>
                <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {isRegister && (
                    <>
                        <div className="mb-3">
                            <label className="form-label">Rol</label>
                            <select
                                className="form-control"
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                            >
                                <option value="admin">Admin</option>
                                <option value="empleado">Empleado</option>
                                <option value="jefe">Jefe</option>
                                <option value="talento_humano">Talento Humano</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">ID de Empleado</label>
                            <input
                                type="text"
                                className="form-control"
                                value={empleado_id}
                                onChange={(e) => setEmpleadoId(e.target.value)}
                            />
                        </div>
                    </>
                )}
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAuth}
                >
                    {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
                </button>
                <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => setIsRegister(!isRegister)}
                >
                    {isRegister ? '¿Ya tienes una cuenta? Iniciar Sesión' : '¿No tienes una cuenta? Registrarse'}
                </button>
            </form>
        </div>
    );
}

export default App;

