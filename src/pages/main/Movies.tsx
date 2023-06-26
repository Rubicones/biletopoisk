"use client";

import btnPlus from "../../../resources/icons/btn-minus.svg";
import btnMinus from "../../../resources/icons/btn-plus.svg";
import remove from "../../../resources/icons/close.svg";
import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import { BasketContext } from "../basketContext";
import Link from "next/link";

interface movieProps {
    isInBasket: boolean;
    movieDetails: movie;
    onCrossClick?: (movie: movie) => void;
}
export const Movie = ({
    isInBasket,
    movieDetails,
    onCrossClick,
}: movieProps) => {
    const { basket, setBasket } = useContext(BasketContext);
    const { title, genre, posterUrl } = movieDetails;
    const [counter, setCounter] = useState(0);

    const onTicketAdd = (operation: number) => {
        let basketCopy = new Map(basket);
        let entry = Array.from(basket.keys()).find(
            (obj) => obj.id === movieDetails.id
        );

        if (entry) {
            basketCopy.forEach((_, key) => {
                if (key.id === movieDetails.id) {
                    basketCopy.set(
                        key,
                        (basketCopy.get(key) as number) + operation
                    );
                }
            });
            if (basketCopy.get(entry) == 0) {
                console.log(basketCopy);
                console.log(1);
                basketCopy.delete(entry);
                console.log(basketCopy);
            }
        } else {
            basketCopy.set(movieDetails, 1);
        }
        setCounter(counter + operation);
        setBasket(basketCopy);
    };

    useEffect(() => {
        let entry = Array.from(basket.keys()).find(
            (obj) => obj.id === movieDetails.id
        );

        if (entry) setCounter(basket.get(entry) as number);
        else setCounter(0);
    }, []);

    return (
        <>
            <div className="movie-container">
                <div className="poster-container">
                    <img src={posterUrl} alt="poster" className="poster" />
                </div>
                <div className="title-genre-container">
                    <Link
                        key={movieDetails.id + "_link"}
                        href={{
                            pathname: "/main/detailedMovie/DetailedMovie",
                            query: { movie: JSON.stringify(movieDetails) },
                        }}>
                        <span className="title">{title}</span>
                    </Link>
                    <span className="genre">{genre}</span>
                </div>
                <div className="utility-buttons-container">
                    <Image
                        src={btnMinus}
                        alt="Remove Ticket Button"
                        width={20}
                        height={20}
                        onClick={() => {
                            let entry = Array.from(basket.keys()).find(
                                (obj) => obj.id === movieDetails.id
                            );
                            if (entry && (basket.get(entry) as number) > 0)
                                onTicketAdd(-1);
                        }}
                    />
                    <div className="counter">{counter}</div>
                    <Image
                        src={btnPlus}
                        alt="Add Ticket Button"
                        width={20}
                        height={20}
                        onClick={() => {
                            if (
                                !basket.has(movieDetails) ||
                                (basket.has(movieDetails) &&
                                    (basket.get(movieDetails) as number) < 30)
                            )
                                onTicketAdd(1);
                        }}
                    />
                    {isInBasket && (
                        <Image
                            src={remove}
                            alt="Remove tickets button"
                            width={32}
                            height={32}
                            onClick={() => {
                                if (onCrossClick) onCrossClick(movieDetails);
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

interface moviesProps {
    filterString: string;
    genreFilter: string;
    cinemaFilter: string;
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
    id: string;
    name: string;
    movieIds: string[];
}

const Movies = ({ filterString, genreFilter, cinemaFilter }: moviesProps) => {
    const { basket, setBasket } = useContext(BasketContext);
    const [movies, setMovies] = useState<movie[]>([]);
    const [allMovies, setAllMovies] = useState<movie[]>([]);
    const [selectedCinemaMovies, setSelectedCinemaMovies] = useState<string[]>(
        []
    );

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

    return (
        <div className="movies-container">
            {movies.map((movie: movie) => {
                return (
                    <Movie
                        movieDetails={movie}
                        key={movie.id}
                        isInBasket={false}
                    />
                );
            })}
        </div>
    );
};

export default Movies;
