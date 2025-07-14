import { createContext } from "react";

export const AppContext = React.createContext()

export const AppContextProvider = (props) => {
    return (
        <AppContext.Provider value={{}}>
            {props.children}
        </AppContext.Provider>
    )
}