"use client";
import Header from "../Header";
import { movie } from "../Movies";
import React, { useEffect, useState, useContext, useRef } from "react";
import { BasketContext } from "../../_app";
import Image from "next/image";
import Footer from "../Footer";
import { useRouter } from "next/router";
import btnPlus from "../../../../resources/icons/btn-minus.svg";
import btnMinus from "../../../../resources/icons/btn-plus.svg";
import posterDummy from "../../../../resources/images/posterDummy.png";
import profilePhotoDummy from "../../../../resources/images/profilePhotoDummy.svg";

interface review {
    id: string;
    rating: number;
    text: string;
    name: string;
}

interface reviewProps {
    reviewDetails: review;
}

const Review = ({ reviewDetails }: reviewProps) => {
    return (
        <div className="review-container">
            <Image
                src={profilePhotoDummy}
                alt="Profile Picture"
                width={100}
                height={100}
            />

            <div className="review-content">
                <div className="review-heading">
                    <span className="name">
                        {reviewDetails ? reviewDetails.name : ""}
                    </span>
                    <span className="rating">
                        Оценка: {reviewDetails ? reviewDetails.rating : ""}
                    </span>
                </div>

                <div className="review-text">
                    {reviewDetails ? reviewDetails.text : ""}
                </div>
            </div>
        </div>
    );
};

export default function DetailedMovie() {
    const router = useRouter();
    const [movie, setMovie] = useState<movie>();
    const { basket, setBasket } = useContext(BasketContext);
    const [counter, setCounter] = useState(0);
    const [reviews, setReviews] = useState<review[]>();

    const containerRef = useRef(null);

    const onTicketAdd = (operation: number) => {
        let basketCopy = new Map(basket);
        let entry = Array.from(basket.keys()).find(
            (obj) => obj.id === movie?.id
        );

        if (entry) {
            basketCopy.forEach((_, key) => {
                if (key.id === movie?.id) {
                    basketCopy.set(
                        key,
                        (basketCopy.get(key) as number) + operation
                    );
                }
            });
            if (basketCopy.get(entry) == 0) {
                basketCopy.delete(entry);
            }
        } else {
            basketCopy.set(movie as movie, 1);
        }
        setCounter(counter + operation);
        setBasket(basketCopy);
    };

    useEffect(() => {
        if (movie) {
            let entry = Array.from(basket.keys()).find(
                (obj) => obj.id === movie.id
            );

            if (entry) setCounter(basket.get(entry) as number);
            else setCounter(0);
        }
    }, [movie]);

    useEffect(() => {
        let { movie } = router.query;
        if (movie) {
            let parsedMovie = JSON.parse(movie as string);
            setMovie(parsedMovie);
            const reviews = fetch(
                `http://localhost:3001/api/reviews?movieId=${parsedMovie.id}`
            );
            reviews
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                    setReviews(res);
                });
        }
    }, []);

    

    return (
        <>
            <Header />
            <div className="detailed-movie-container" ref={containerRef}>
                <div className="movie-card-container">
                    <img
                        src={movie ? movie.posterUrl : posterDummy.src}
                        alt="Movie Poster"
                        className="fullsize-poster"
                    />

                    <div className="movie-card-info-container">
                        <div className="info-heading">
                            <span className="heading">
                                {movie ? movie.title : ""}
                            </span>
                            <div className="utility-buttons-container">
                                <Image
                                    src={btnMinus}
                                    alt="Remove Ticket Button"
                                    width={20}
                                    height={20}
                                    onClick={() => {
                                        let entry = Array.from(
                                            basket.keys()
                                        ).find((obj) => obj.id === movie?.id);
                                        if (
                                            entry &&
                                            (basket.get(entry) as number) > 0
                                        )
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
                                        if (movie) {
                                            if (
                                                !basket.has(movie) ||
                                                (basket.has(movie) &&
                                                    (basket.get(
                                                        movie
                                                    ) as number) < 30)
                                            )
                                                onTicketAdd(1);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="short-info">
                            <div className="category-title">Жанр:</div>
                            <div className="category-value">
                                {movie ? movie.genre : ""}
                            </div>
                        </div>
                        <div className="short-info">
                            <div className="category-title">Год выпуска:</div>
                            <div className="category-value">
                                {movie ? movie.releaseYear : ""}
                            </div>
                        </div>
                        <div className="short-info">
                            <div className="category-title">Рейтинг:</div>
                            <div className="category-value">
                                {movie ? movie.rating : ""}
                            </div>
                        </div>
                        <div className="short-info">
                            <div className="category-title">Режиссер:</div>
                            <div className="category-value">
                                {movie ? movie.director : ""}
                            </div>
                        </div>
                        <div className="info-description">
                            <div className="description-heading">Описание</div>
                            <div className="movie-description">
                                {movie ? movie.description : ""}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="reviews-container">
            {reviews?.map((review, i) => {
                return <Review key={review.id} reviewDetails={review} />;
            })}
            </div>
            
            <Footer />
        </>
    );
}
