"use client";
import Header from "../Header";
import { Movie, movie } from "../Movies";
import React, { useEffect, useState, useContext, useRef } from "react";
import { BasketContext } from "../../basketContext";
import Image from "next/image";
import remove from "../../../../resources/icons/close.svg";
import Footer from "../Footer";

export default function Basket() {
    const { basket, setBasket } = useContext(BasketContext);
    const [movies, setMovies] = useState<movie[]>([]);
    const [movieToRemove, setMovieToRemove] = useState<movie | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const modalWindow = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        let moviesArr: movie[] = [];
        basket.forEach((_: number, key: movie) => {
            moviesArr.push(key);
        });
        setMovies(moviesArr);

        let counter = 0;

        basket.forEach((value) => {
            counter += value;
        });
        setTotalCount(counter);
    }, [basket]);

    const onRemoveTickets = (state: boolean) => {
        if (state) {
            let basketCopy = new Map(basket);
            basketCopy.delete(movieToRemove as movie);
            setBasket(basketCopy);
        }
        setMovieToRemove(null);
        if (modalWindow.current)
            modalWindow.current.close();
    };

    const closeModal = (event: MouseEvent) => {
        if(modalWindow.current) { 
            var rect = modalWindow.current.getBoundingClientRect();
            var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
            && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                modalWindow.current.close();
            }
        }
    }

    useEffect(() => {
        let dialog = document.querySelector("dialog")
        if (modalWindow.current && dialog){
            dialog.addEventListener("click", closeModal)
        }

        return () => {
            if (dialog)
                dialog.removeEventListener("click", closeModal)
        }
        
    }, [modalWindow])

    return (
        <>
            <Header />

            {movies.length == 0 && (
                    <div className="empty-basket-warning">
                        Тут пока ничего нет
                    </div>
                )}
            <div className="basket-movies-container">
                <dialog
                    open={false}
                    className="modal-remove-ticket"
                    ref={modalWindow}
                >
                    <div className="modal-header">
                        <span className="modal-heading">Удаление билета</span>
                        <Image
                            className="close-modal-btn"
                            width={16}
                            height={16}
                            src={remove}
                            alt="close window"
                            onClick={() => {
                                if (modalWindow.current)
                                    modalWindow.current.close();
                            }}
                        />
                    </div>
                    <div className="modal-warn">
                        Вы уверены, что хотите удалить билет?
                    </div>

                    <button
                        value="true"
                        className="yes-btn modal-button"
                        onClick={() => {
                            onRemoveTickets(true);
                        }}
                    >
                        Да
                    </button>
                    <button
                        value="false"
                        className="no-btn modal-button"
                        onClick={() => {
                            onRemoveTickets(false);
                        }}
                    >
                        Нет
                    </button>
                </dialog>

                {movies.map((movie: movie) => {
                    return (
                        <Movie
                            key={movie.id}
                            isInBasket={true}
                            movieDetails={movie}
                            onCrossClick={(movie: movie) => {
                                setMovieToRemove(movie);
                                if (modalWindow.current)
                                    modalWindow.current.showModal();
                            }}
                        />
                    );
                })}

                <div className="total-block">
                    <span className="total-heading">Итого билетов:</span>
                    <span className="total-sum">{totalCount}</span>
                </div>
            </div>
            <Footer />
        </>
    );
}
