import axios from 'axios';
import React from 'react';
const BASE_URL = "http://www.omdbapi.com/?apikey=9d4ff0f8";

const FetchApi = async () =>{

    const response = await axios.get(`${BASE_URL}`);
    return response.data;

};
const GetApi = () => {};

export {FetchApi};
export default GetApi;