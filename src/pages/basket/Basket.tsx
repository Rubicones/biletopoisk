"use client";
import Header from "../main/Header";
import { useRouter } from "next/router";
import { Movie, movie } from "../main/Movies";
import { useEffect, useState } from "react";

export default function Basket() {
    const [basket, setBasket] = useState(new Map());
    const [movies, setMovies] = useState<movie[]>([]);
    const [modalActive, setModalActive] = useState(false)
    const router = useRouter();
    useEffect(() => {
        const query = router.query;
        if (query.basket)
            setBasket(JSON.parse(query.basket as string, reviver));
    }, []);

    const reviver = (key: string, value: any) => {
        if (typeof value === "object" && value !== null) {
            if (value.dataType === "Map") {
                return new Map(value.value);
            }
        }
        return value;
    }

    const onRemoveTickets = (id: string) => {
        setModalActive(true)
    }

    useEffect(() => {
        console.log(1);
        if (basket.size > 0) {
            basket.forEach((_, key) => {
                let movie = fetch(
                    `http://localhost:3001/api/movie?movieId=${key}`
                );
                movie
                    .then((res) => res.json())
                    .then((res) => setMovies((oldArr) => [...oldArr, res]));
            });
        }
    }, [basket]);

    return (
        <>
            <Header basket={basket} />
            <div className="basket-movies-container">
                {movies.map((movie: movie) => {
                    return (
                        <Movie
                            key={movie.id}
                            title={movie.title}
                            genre={movie.genre}
                            src={movie.posterUrl}
                            id={movie.id}
                            isInBasket={true}
                            ticketsCount={
                                basket.has(movie.id)
                                    ? (basket.get(movie.id) as number)
                                    : 0
                            }
                            onCounterChange={(op: number, id: string) => {
                                // onTicketAdd(op, id);
                            }}
                        />
                    );
                })}
            </div>
        </>
    );
}
