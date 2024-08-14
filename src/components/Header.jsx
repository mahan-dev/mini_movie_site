import React, { createContext, useContext, useEffect, useState } from 'react';
import headerIcon from "../assets/header_icon/film.svg";
import axios from 'axios';
import { MovieProvider } from '../context/MovieApiContext';
const BASE_URL = "http://www.omdbapi.com/?apikey=9d4ff0f8&s=";
import Styles from "../styles/Home.module.css";
export const Propp = createContext()
const Header = () => {

    const [search, setSearch] = useState("");
    const [apiLists, setApiList] = useState([]);
    const [movie, setMovie] = useState([]);

    const {setSearchValue, itemsCounter} = useContext(MovieProvider)
//     const getApiLists = async (query, page) => {
//         try {
//             const response = await axios.get(`${BASE_URL}${query}&page=${page}`)
//             const data = response.data;
//             if (data.Response === "True") {
//                 setApiList(
//                     prevMovie =>
//                         [...prevMovie, data.Search]

//                 )
//             }

//         }
//         catch (error) {
//             console.log("we have trouble... ", error)
//         }

    

// }

    const inputChangeHandler = (e)=>{
        let searchValue = e.target.value;
        setSearch(searchValue);
        setSearchValue(searchValue);
        // getApiLists(searchValue, 1)
    }
    useEffect(()=>{

    }, [itemsCounter,search])



    return (
        <section className='mt-6'>

            
            <header className='flex justify-between text-white rounded-md bg-[#333C47] p-4 py-4'>
                <img src={headerIcon} width={30} alt="" />
                <input type="text" placeholder='look for something ?' onChange={ (e)=> inputChangeHandler(e) } className='rounded-md px-1 outline-none text-white bg-[#3f4753]' />
                <p className={`${Styles.result_header}`}>{`Found ${itemsCounter} result`}</p>
            </header>
            
        </section>
    );
};

export default Header;