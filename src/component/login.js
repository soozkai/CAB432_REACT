import React, { useState } from 'react';
import { TextField, Button, Container, Card, CardContent, Typography, LinearProgress } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async () => {
        if (!username || !password) {
            toast.error('Please fill in both fields!');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username, password });

            const { token } = response.data;
            if (token) {
                localStorage.setItem('username', username);
                console.log('Username set in localStorage:', username);
                localStorage.setItem('token', token);
                toast.success('Login successful!');
                onLoginSuccess(username);
                navigate('/');  // Add this line to redirect to the dashboard after successful login
            } else {
                toast.error('Failed to retrieve token!');
            }
        } catch (error) {
            toast.error('Login failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" style={{ marginTop: '100px' }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        Login
                    </Typography>
                    <TextField
                        label="Username"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
                    <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
                        Login
                    </Button>
                    {loading && <LinearProgress style={{ marginTop: '20px' }} />}
                </CardContent>
            </Card>
            <ToastContainer />
        </Container>
    );
};

export default Login;
