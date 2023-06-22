"use client";

import btnPlus from "../../../resources/icons/btn-minus.svg";
import btnMinus from "../../../resources/icons/btn-plus.svg";
import remove from "../../../resources/icons/close.svg";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { BasketContext } from '../index'

interface movieProps {
    title: string;
    genre: string;
    src: string;
    id: string;
    ticketsCount: number;
    onCounterChange: (op: number, id: string) => void;
    isInBasket: boolean
    onRemoveTickets?: (id: string) => void
}
export const Movie = ({ title, genre, src, onCounterChange, id, ticketsCount, isInBasket, onRemoveTickets }: movieProps) => {
    const changeTicketsCounter = (operation: number) => {
        onCounterChange(operation, id);
    };

    return (
        <>
            <div className="movie-container">
                <div className="poster-container">
                    <img src={src} alt="poster" className="poster" />
                </div>
                <div className="title-genre-container">
                    <span className="title">{title}</span>
                    <span className="genre">{genre}</span>
                </div>
                <div className="utility-buttons-container">
                    <Image
                        src={btnMinus}
                        alt="Remove Ticket Button"
                        width={20}
                        height={20}
                        onClick={() => {
                            if (ticketsCount > 0) changeTicketsCounter(-1);
                        }}
                    />
                    <div className="counter">{ticketsCount}</div>
                    <Image
                        src={btnPlus}
                        alt="Add Ticket Button"
                        width={20}
                        height={20}
                        onClick={() => {
                            if (ticketsCount < 30) changeTicketsCounter(1);
                        }}
                    />
                    {isInBasket && (
                        <Image
                        src={remove}
                        alt="Remove tickets button"
                        width={32}
                        height={32}
                        onClick={() => {
                            if (onRemoveTickets)
                                onRemoveTickets(id);
                        }}
                    />
                    )}
                    
                </div>
            </div>
        </>
    );
};

interface moviesProps {
    onCounterChange: (moviesMap: Map<string, number>) => void;
    filterString: string;
    genreFilter: string;
    cinemaFilter: string;
    basket: Map<string, number>;

}

export interface movie {
    description: string;
    director: string;
    genre: string;
    id: string;
    posterUrl: string;
    rating: number;
    releaseYear: number;
    reviewIds: string[];
    title: string;
}

interface cinema {
    id: string
    name: string
    movieIds: string[]
}

const Movies = ({
    filterString,
    genreFilter,
    cinemaFilter,
}: moviesProps) => {
    const [movies, setMovies] = useState<movie[]>([]);
    const [allMovies, setAllMovies] = useState<movie[]>([]);
    const [basketTickets, setBasketTickets] = useState<Map<string, number>>(new Map());
    const [selectedCinemaMovies, setSelectedCinemaMovies] = useState<string[]>(
        []
    );

    const {basket, setBasket} = useContext(BasketContext)
    

    useEffect(() => {
        if (basketTickets.size === 0)
            setBasketTickets(basket)
    }, [basket])

    useEffect(() => {
        let moviesReq = fetch("http://localhost:3001/api/movies");
        moviesReq
            .then((res) => res.json())
            .then((res) => {
                res = res.map((movie: movie) => {
                    switch (movie.genre) {
                        case "fantasy":
                            movie.genre = "Фэнтези";
                            break;
                        case "comedy":
                            movie.genre = "Комедия";
                            break;
                        case "action":
                            movie.genre = "Боевик";
                            break;
                        case "horror":
                            movie.genre = "Ужасы";
                            break;
                    }

                    return movie;
                });
                setMovies(res);
                setAllMovies(res);
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        if (cinemaFilter !== "Не выбран") {
            let cinemas = fetch("http://localhost:3001/api/cinemas");
            cinemas
                .then((res) => res.json())
                .then((res) => {
                    res.forEach((cinema: cinema) => {
                        console.log(cinema)
                        if (cinema.name === cinemaFilter)
                            setSelectedCinemaMovies(cinema.movieIds);
                    });
                });
        } else {
            setSelectedCinemaMovies([]);
        }
    }, [cinemaFilter]);

    useEffect(() => {
        let filteredMovies = allMovies;

        if (selectedCinemaMovies.length > 0) {
            filteredMovies = filteredMovies.filter((movie) =>
                selectedCinemaMovies.includes(movie.id)
            );
        }

        if (genreFilter !== "Не выбран") {
            filteredMovies = filteredMovies.filter(
                (movie) => movie.genre === genreFilter
            );
        }

        if (filterString !== "") {
            filteredMovies = filteredMovies.filter((movie) =>
                movie.title.toLowerCase().includes(filterString.toLowerCase())
            );
        }

        setMovies(filteredMovies);
        //eslint-disable-next-line
    }, [filterString, genreFilter, cinemaFilter, selectedCinemaMovies]);

    const onTicketAdd = (operation: number, id: string) => {
        let basketTicketsCopy = new Map(basketTickets)
        if (basketTicketsCopy.has(id)){
            basketTicketsCopy.set(id, (basketTicketsCopy.get(id) as number) + operation)
            if (basketTicketsCopy.get(id) == 0)
                basketTicketsCopy.delete(id)
        } else {
            basketTicketsCopy.set(id, 1)
        }
        setBasketTickets(basketTicketsCopy)
        setBasket(basketTicketsCopy);
    };

    return (
        <div className="movies-container">
            {movies.map((movie: movie) => {
                return (
                    <Movie
                        key={movie.id}
                        title={movie.title}
                        genre={movie.genre}
                        src={movie.posterUrl}
                        id={movie.id}
                        isInBasket={false}
                        ticketsCount={basketTickets.has(movie.id) ? basketTickets.get(movie.id) as number : 0}
                        onCounterChange={(op: number, id: string) => {
                            onTicketAdd(op, id);
                        }}
                    />
                );
            })}
        </div>
    );
};

export default Movies;
