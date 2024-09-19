import { Button, Card, CardContent, Container, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Navigate } from "react-router-dom";

const LoginPage = () => {

    const { session, login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    if (session) {
        return <Navigate to="/" replace />
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        console.log(formData);
        login(formData);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <Container maxWidth="sm" className="my-12">
            <Card variant="outlined">
                <CardContent className='!p-8'>
                    <Typography variant="h5" component="h5" className="text-center !mb-8">
                        Please Log In to RemindMe
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            autoFocus
                            label="Email"
                            fullWidth
                            type="email"
                            name="email"
                            autoComplete="off"
                            variant="outlined"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="!mb-8"
                        />
                        <TextField
                            label="Password"
                            fullWidth
                            type="password"
                            name="password"
                            autoComplete="off"
                            variant="outlined"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="!mb-8"
                        />

                        <Button variant="contained" className="!py-2" fullWidth type="submit">
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    )
}

export default LoginPage;