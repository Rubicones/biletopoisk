"use client";
import Header from "../Header";
import { Movie, movie } from "../Movies";
import { useEffect, useState, useContext } from "react";
import { BasketContext } from "../../basketContext";

export default function Basket() {
    const { basket } = useContext(BasketContext);
    const [movies, setMovies] = useState<movie[]>([]);
    const [modalActive, setModalActive] = useState(false);

    useEffect(() => {
        let moviesArr: movie[] = [];
        basket.forEach((_: number, key: movie) => {
            moviesArr.push(key);
        });
        setMovies(moviesArr);
    }, [basket]);

    const onRemoveTickets = (id: string) => {
        setModalActive(true);
    };

    return (
        <>
            <Header />
            <div className="basket-movies-container">
                {movies.map((movie: movie) => {
                    return (
                        <Movie
                            key={movie.id}
                            isInBasket={true}
                            movieDetails={movie}
                        />
                    );
                })}
            </div>
        </>
    );
}
