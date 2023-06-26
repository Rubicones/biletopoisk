"use client";
import Header from "../Header";
import React, { useState } from "react";
import Footer from "../Footer";
import dropdown from "../../../../resources/icons/dropdown.svg";
import Image from "next/image";

interface questionProps {
    question: string;
    answer: string;
}

const Question = ({ question, answer }: questionProps) => {
    let [isDropActive, setIsDropActive] = useState(false);

    return (
        <div className="question-container">
            <div className="question-heading">
                <span>{question}</span>
                <Image
                    className="dropdown-btn"
                    src={dropdown}
                    alt="dropdown button"
                    width={18}
                    height={18}
                    onClick={() => setIsDropActive(!isDropActive)}
                />
            </div>
            {isDropActive && <div className="answer">{answer}</div>}
        </div>
    );
};

export default function QnA() {
    const qnaTokens: { q: string; a: string }[] = [
        {
            q: "Что такое Билетопоиск?",
            a: "Мы — крупнейший сервис о кино в рунете. На нем вы сможете посмотреть фильмы и сериалы, купить билеты в кино, узнать рейтинги популярных видео и интересные факты, поставить фильмам оценки, написать рецензии и дополнить описание фильмов.",
        },
        {
            q: "Какой компании принадлежит Билетопоиск?",
            a: "Билетопоиск принадлежит компании Мындекс",
        },
        {
            q: "Как купить билет на Билетопоиск?",
            a: "Всё здесь, но на других страницах!",
        },
        {
            q: "Как оставить отзыв на Билетопоиск?",
            a: `¯\\_(ツ)_/¯`,
        },
    ];
    return (
        <>
            <Header />

            <div className="q-n-a-container">
                <div className="q-n-a-header">
                    <span>Вопросы-ответы</span>
                </div>

                <div className="questions-container">
                    {qnaTokens.map((item, i) => {
                        return (
                            <Question
                                key={i}
                                question={item.q}
                                answer={item.a}
                            />
                        );
                    })}
                </div>
            </div>

            <Footer />
        </>
    );
}
