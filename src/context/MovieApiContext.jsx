import React, { createContext, useState } from 'react';
import axios from 'axios';

export const MovieProvider = createContext();
const MovieApiContext = ({children}) => {
    const [searchValue, setSearchValue] = useState("");
    const [itemsCounter, setItemsCounter] = useState(0);
    return (
        <div>

            <MovieProvider.Provider value={{searchValue, setSearchValue, itemsCounter, setItemsCounter}}>
                {children}
            </MovieProvider.Provider>
            
        </div>
    );
};

export default MovieApiContext;