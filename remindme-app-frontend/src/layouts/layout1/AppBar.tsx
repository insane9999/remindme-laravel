import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../../auth/AuthProvider";

const Layout1AppBar = () => {

    const { session, logout } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    RemindMe
                </Typography>
                {
                    session
                        ?
                        <>
                            <Typography variant="h6">{session.user.name}</Typography>
                            <Button variant="outlined" color="primary" className="!text-white" onClick={() => logout()}>Logout</Button>
                        </>
                        :
                        <>
                        </>
                }

            </Toolbar>
        </AppBar>
    )
}

export default Layout1AppBar;