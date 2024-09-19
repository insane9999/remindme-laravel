import { PropsWithChildren } from "react";
import Layout1AppBar from "./AppBar";
import { useAuth } from "../../auth/AuthProvider";

const Layout1: React.FC<PropsWithChildren> = (props) => {

    return (
        <>
            <Layout1AppBar />
            {props.children}
        </>
    )
}

export default Layout1;