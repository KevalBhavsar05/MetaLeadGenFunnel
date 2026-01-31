import { useVerifyAdmin } from "@/hooks/useAdminAuth";
import { createContext, useContext } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const {
        data: user,
        isPending: isAuthLoading,
        isError: isAuthError
    } = useVerifyAdmin()
    const contextValue = {
        user,
        isAuthLoading,
        isAuthError
    };
    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}
export { AppContext, AppProvider, useApp };