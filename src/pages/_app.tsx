import '../styles/globals.css'
import '../styles/Basket.sass'
import '../styles/Filters.sass'
import '../styles/Main.sass'
import '../styles/Movies.sass'
import '../styles/Footer.sass'
import '../styles/DetailedMovie.sass'
import '../styles/QnA.sass'
import '../styles/AboutUs.sass'
import { movie } from './main/Movies'
import { useState } from 'react'
import { AppProps } from 'next/app';
import React from 'react';



export const BasketContext = React.createContext<{
    basket: Map<movie, number>;
    setBasket: React.Dispatch<React.SetStateAction<Map<movie, number>>>;
}>({ basket: new Map<movie, number>(), setBasket: () => {} });

const MyContextProvider = BasketContext.Provider;
const MyContextConsumer = BasketContext.Consumer;

export default function App({ Component, pageProps }: AppProps) {
    const [basket, setBasket] = useState<Map<movie, number>>(new Map());

    return (<BasketContext.Provider
            value={{ basket: basket, setBasket: setBasket }}
        >
        <Component {...pageProps} />
        </BasketContext.Provider>)
  }