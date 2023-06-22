'use client'
import Main from "./main/Main"
import React, {useState} from "react";

export const BasketContext = React.createContext<{
  basket: Map<string, number>;
  setBasket: React.Dispatch<React.SetStateAction<Map<string, number>>>;
}>({ basket: new Map<string, number>(), setBasket: () => {} });

export default function Home() {
  const [basket, setBasket] = useState(new Map<string, number>());
  return (
    <BasketContext.Provider
    value={{ basket: basket, setBasket: setBasket }}>
      <Main/>
    </BasketContext.Provider>
  )
}
