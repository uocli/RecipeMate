import { Button, Container, Grid2 as Grid, Typography } from "@mui/material";
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Container component="main" maxWidth="xs" sx={{ textAlign: 'center', marginTop: 8 }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                    <Typography variant="h1" color="primary" sx={{ fontSize: '6rem', fontWeight: 'bold' }}>
                        404
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" color="textSecondary" sx={{ marginBottom: 2 }}>
                        Oops! The page doesn’t exist.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        color="primary"
                        sx={{ padding: '10px 20px', fontSize: '1rem' }}
                    >
                        Go to Home
                    </Button>
                </Grid>
            </Grid>
        </Container>)
};

export default NotFound;
