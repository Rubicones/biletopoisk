"use client";

import Filters from "./Filters";
import Movies from "./Movies";
import Header from "./Header";
import React, { useState } from "react";
import Footer from "./Footer";

export default function Main() {
    const [filterString, setFilterString] = useState("");
    const [genreFilter, setGenreFilter] = useState("Не выбран");
    const [cinemaFilter, setCinemaFilter] = useState("Не выбран");

    return (
        <>
            <Header />
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

                />
            </section>
            <Footer/>
        </>
    );
}
