import React, { useContext, useEffect, useState } from 'react';
import Header from './Header';

const BASE_URL = "http://www.omdbapi.com/?apikey=9d4ff0f8&s=";

import Styles from "../styles/Home.module.css";
import { MovieProvider } from '../context/MovieApiContext';
import axios, { formToJSON } from 'axios';
import styled from 'styled-components';
import arrowLeftIcon from "../assets/PosterIcons/arrow-left-long.svg";
import minusIcon from "../assets/PosterIcons/circle-minus.svg";

import FilledStar from "../assets/rate_star_icon/FilledStar.svg";
import EmptyStar from "../assets/rate_star_icon/EmptyStar.svg";


// Styled Components Part !!!!
const ArrowClicked = styled.div`

display : ${props => (props.clicked) ? 'flex' : "none"};



`




// Styled Components Part !!!!

const Home = () => {
    const [loading, setLoading] = useState(true);
    const { searchValue, setItemsCounter } = useContext(MovieProvider)
    const [movieList, setMovieList] = useState([]);
    const [selected, setSelected] = useState();
    // const [watch, setWatch] = useState([])
    const [watch, setWatch] = useState(() => {
        const saveData = localStorage.getItem("movieWatched");
        return saveData ? JSON.parse(saveData) : []

    })
    const [clickArrow, setClickArrow] = useState(false);

    const [starRate, setStarRate] = useState({});
    const [saveApiD, setSaveApiD] = useState([]);

    // part for give feedback or rate to movie - user 
    const numberStars = 10;


    const saveData = () => {
        const existMovie = saveApiD.findIndex(item => item.imdbID === selected.imdbID)
        const selectedPart = {
            imdbID: selected.imdbID,
            title: selected.Title,
            rating: starRate[selected.imdbID] || 0,
        }

        if (existMovie !== -1) {
            const updateApiID = [...saveApiD];
            updateApiID[existMovie] = selectedPart;
            setSaveApiD(updateApiID);
        } else {
            setSaveApiD(
                [...saveApiD,
                    selectedPart
                ]
            )
        }
    }




    const clickedPoster = (poster) => {


        setSelected(poster)
        setClickArrow(false)
        if (window.innerHeight < 768) {

            const target = document.getElementById("posterMovie")
            target.scrollIntoView({ behavior: "smooth" });
        }

        console.log(poster)
        console.log(starRate)

        const isMovieWatched = watch.find(item => item.imdbID === poster.imdbID)
        console.log(watch)
        console.log(isMovieWatched)
        console.log(poster)
        if (!isMovieWatched) {
            setWatch([...watch, poster])
        }
        console.log(watch)

    }
    // clickedPoster()



    const fetchMovieDetails = async (movieId) => {
        try {
            const response = await axios.get(`${BASE_URL}&i=${movieId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return null;
        }
    };

    const ReceiveApi = async (query, page) => {
        try {
            if (!query && query.trim() == "") {
                setMovieList([]);
                setItemsCounter(0);
                return;
            }

            const response = await axios.get(`${BASE_URL}&s=${query}&page=${page}`);
            const data = response.data;
            if (data.Response === "True") {
                const detailedMovies = await Promise.all(
                    data.Search.map(movie => fetchMovieDetails(movie.imdbID))
                );
                setMovieList(detailedMovies);
                setItemsCounter(detailedMovies.length);
            }
        } catch (error) {
            console.log("Error occurred while fetching movies:", error);
        }
    };

    const checkProductsLoad = () => {
        if (movieList) {
            setLoading(false)
        }
    }

    const arrowLeftHandler = () => {

        setClickArrow(true)

    }


    const starHandler = (rating) => {
        setStarRate(
            prevS => ({
                ...prevS,
                [selected.imdbID]: rating
            })

        )
    }

    const minusHandler =(poster)=>{
        const deleteIndex = watch.filter(item => item.imdbID !== poster.imdbID)
        setWatch(
            [...deleteIndex]
        )

        localStorage.setItem("movieWatched", JSON.stringify(watch))



    }


  
    
    
    useEffect(() => {
        localStorage.setItem('movieWatched', JSON.stringify(watch))

        if (selected) {
            saveData();
        }
        checkProductsLoad();
        ReceiveApi(searchValue, 1);



    }, [searchValue, clickArrow, starRate, selected]);

    console.log(searchValue)

    return (
        <section className=' px-6 '>

            {
                console.log(saveApiD)

            }
            {console.log(selected)}
            <Header />
            <section className={`${Styles.wrapper_content} my-6`} >

                {/*  LEFT SIDE  */}
                <section className={`${movieList == "" ? "flex justify-center h-fit py-5 " : "pb-4"} flex flex-col  bg-[#333C47] text-white rounded-md  `}>
                    {/* {
                    movieList == "" ? (
                    <div className='flex justify-center' >
                        no item found
                    </div>) : ""
                   } */}

                    {

                        loading ?
                            (
                                <div> loading..................... </div>
                            ) :

                            (
                                movieList && searchValue !== "" && searchValue.trim() && movieList.length > 0 ? (
                                    movieList.map((movie, index) => (
                                        <section
                                            onClick={() => clickedPoster(movie)}
                                            key={index}
                                            className='border-b-2 cursor-pointer '
                                        >
                                            <div className='flex gap-5 my-4 mx-6'>
                                                <img className='rounded-md' src={movie.Poster} alt="" width={100} />
                                                <section className='flex flex-col justify-center'>
                                                    <div>
                                                        {movie.Title}
                                                    </div>
                                                    <div>
                                                        {movie.Genre}
                                                    </div>
                                                    <div>
                                                        {movie.Year}
                                                    </div>
                                                    <div>
                                                        <p>{`imdb Rating ${movie.imdbRating}`} </p>
                                                    </div>
                                                </section>

                                            </div>
                                        </section>
                                    ))
                                ) :
                                    (
                                        <div className='flex justify-center text-center text-[1.2rem]'>no movies found !</div>

                                    )
                            )

                    }
                </section>


                {/*  RIGHT SIDE  */}


                <section className={` bg-[#333C47] text-white rounded-md overflow-hidden h-fit `}>
                    {/*  */}
                    {
                        selected || localStorage.getItem("movieSelected") ? (

                            <div className='flex '>
                                {clickArrow ?
                                    "" :
                                    (
                                        <section id='posterMovie' className='flex flex-col mb-4 gap-4 w-full'>

                                            <section className='flex gap-6'>

                                                <div className='relative'>

                                                    <div
                                                        onClick={arrowLeftHandler}
                                                        className='absolute cursor-pointer left-3 top-3 bg-white p-1 rounded-full '
                                                    >
                                                        <img src={arrowLeftIcon} alt="" width={20} />
                                                    </div>
                                                    <img className='object-cover' src={selected.Poster} alt="" width={150} />
                                                </div>
                                                <div className='mt-4 flex flex-col gap-2'>
                                                    <p className=''>{selected.Title}</p>
                                                    <p className=''>{`${selected.Released} . ${selected.Runtime}`}</p>
                                                    <p className=''> {selected.Genre} </p>
                                                    <p className=''> {`${selected.imdbRating} IMDb rating`} </p>
                                                </div>
                                            </section>


                                            <div className='flex bg-[#1E242B] self-center w-fit p-4 rounded-md'>
                                                {Array.from({ length: numberStars }, (_, i) => (
                                                    <section className='flex justify-center' key={i}>
                                                        <span className='cursor-pointer' onClick={() => starHandler(i + 1)}>
                                                            <img src={i < (starRate[selected.imdbID] || 0) ? FilledStar : EmptyStar} alt="" width={20} />
                                                            {
                                                            console.log(starRate[selected.imdbID])
                                                            }
                                                        </span>
                                                    </section>
                                                ))}
                                            </div>
                                            <p className='text-center'>Your Rated {starRate[selected.imdbID] || "Not Rated"}</p>
                                        </section>
                                    )

                                }

                                {console.log(starRate[selected.imdbID])}

                            </div>

                        ) :
                        
                            watch.length > 0 && !selected &&  searchValue === ""  ?
                            
                                    (
                                        <div className='m-4'>
                                            <p className=' mb-6 text-2xl rounded-md bg-[#1E242B] p-3 w-full'>watched movie</p>
                                            <div className='flex w-full flex-col gap-4 mt-4'>
    
                                                {watch.map((movie, index) => (
                                                    <div className='flex items-center cursor-pointer relative' key={index}>
                                                        <div  className='flex gap-4 items-center w-full justify-between'>

                                                            <div onClick={() => clickedPoster(movie)} className='flex gap-4  justify-between'>

                                                            <div>
                                                                <img src={movie.Poster} alt="" width={100} style={{ objectFit: 'cover', borderRadius: "0.375rem" }} />
                                                            </div>
                                                            <div className='flex flex-col  w-[200px]'>
                                                                <p>{movie.Title}</p>
                                                                <p>{movie.Released}</p>
                                                                <p>{movie.Genre}</p>
                                                            </div>
                                                            </div>
    
                                                        <div onClick={() => minusHandler(movie)} className='flex relative z-10 self-start '>
                                                            <img src={minusIcon} alt="" width={20} />
                                                        </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                     ) : (<p className='py-5 text-center text-[1.2rem]'>nothing to show</p> )
                                    

                        
                    }
                    <section className='flex'>
                        {
                            watch.length > 0 && clickArrow ?
                                (
                                    <div className='m-4 w-full'>
                                        <p className=' mb-6 text-2xl rounded-md bg-[#1E242B] p-3 w-full'>watched movie</p>
                                        <div className='flex w-full flex-col gap-4 mt-4'>

                                            {watch.map((movie, index) => (
                                                <div className='flex items-center cursor-pointer relative' key={index}>
                                                    <div onClick={() => clickedPoster(movie)} className='flex gap-4 items-center'>


                                                        <div>
                                                            <img src={movie.Poster} alt="" width={100} style={{ objectFit: 'cover', borderRadius: "0.375rem" }} />
                                                        </div>
                                                        <div className='flex flex-col w-[200px] '>
                                                            <p>{movie.Title}</p>
                                                            <p>{movie.Released}</p>
                                                            <p>{movie.Genre}</p>
                                                        </div>

                                                    </div>
                                                    <div onClick={() => minusHandler(movie)} className='absolute top-3 right-0'>
                                                        <img src={minusIcon} alt="" width={20} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) 
                                : ""

                        }


                        {
                             watch && !selected ? console.log("is true") : console.log("is not ")
                        }
                    </section>




                    
                </section>
            </section>
        </section>
    );
};

export default Home;
