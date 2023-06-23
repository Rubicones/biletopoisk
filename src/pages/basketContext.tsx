import React from 'react';
import { movie } from './main/Movies';

export const BasketContext = React.createContext<{
    basket: Map<movie, number>;
    setBasket: React.Dispatch<React.SetStateAction<Map<movie, number>>>;
}>({ basket: new Map<movie, number>(), setBasket: () => {} });

export const MyContextProvider = BasketContext.Provider;
export const MyContextConsumer = BasketContext.Consumer;

export default BasketContext;
