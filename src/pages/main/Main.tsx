"use client";

import Filters from "./Filters";
import Movies from "./Movies";
import Header from "./Header";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { replacer } from "./Header";
import { BasketContext } from "../index";
import { useContext } from "react";

export default function Main() {
    const router = useRouter();
    const query = router.query;

    const [filterString, setFilterString] = useState("");
    const [genreFilter, setGenreFilter] = useState("Не выбран");
    const [cinemaFilter, setCinemaFilter] = useState("Не выбран");
    const {basket, setBasket} = useContext(BasketContext)

    function reviver(key: string, value: any) {
        if (typeof value === "object" && value !== null) {
            if (value.dataType === "Map") {
                return new Map(value.value);
            }
        }
        return value;
    }

    return (
        <>
            <Header basket={basket} />
            <section className="main-section">
                <Filters
                    onFilterStringInput={(str: string) => {
                        setFilterString(str);
                    }}
                    onGenreFilterSet={(str: string) => {
                        setGenreFilter(str);
                    }}
                    onCinemaFilterSet={(str: string) => {
                        setCinemaFilter(str);
                    }}
                />
                <Movies
                    filterString={filterString}
                    genreFilter={genreFilter}
                    cinemaFilter={cinemaFilter}
                    onCounterChange={(basketHere) => {
                        setBasket(basketHere);
                    }}
                />
            </section>
        </>
    );
}
