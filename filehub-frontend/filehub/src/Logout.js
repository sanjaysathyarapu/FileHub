import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Logout = () => {
    const { logout } = useAuth0();

    useEffect(() => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    }, [logout]);

    return null; // Component doesn't render anything, so return null
};

export default Logout;