import '../styles/globals.css'
import '../styles/Basket.sass'
import '../styles/Filters.sass'
import '../styles/Main.sass'
import '../styles/Movies.sass'
import '../styles/Footer.sass'
import '../styles/DetailedMovie.sass'
import '../styles/QnA.sass'
import '../styles/AboutUs.sass'
import BasketContext from './basketContext'
import { movie } from './main/Movies'
import { useState } from 'react'
import { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
    const [basket, setBasket] = useState<Map<movie, number>>(new Map());

    return (<BasketContext.Provider
            value={{ basket: basket, setBasket: setBasket }}
        >
        <Component {...pageProps} />
        </BasketContext.Provider>)
  }