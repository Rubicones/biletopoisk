import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { BasketContext } from "../basketContext";
import { movie } from "./Movies";

export function replacer(key: string, value: any) {
    if (value instanceof Map) {
        return {
            dataType: "Map",
            value: Array.from(value.entries()),
        };
    } else {
        return value;
    }
}
export default function Header() {
    const [totalCounter, setTotalCounter] = useState(0);
    const {basket, setBasket} = useContext(BasketContext);

    useEffect(() => {
        if (basket) {
            let counter = 0;

            basket.forEach((value) => {
                counter += value;
            });
            setTotalCounter(counter);
        }
    }, [basket]);

    return (
        <header>
            <Link
                href={{
                    pathname: "/main/Main",
                    query: { basket: JSON.stringify(basket, replacer) },
                }}
            >
                <h1>Билетопоиск</h1>
            </Link>
            <div className="basket-container">
                <div className="basket-counter">
                    <span className="backet-counter-text">{totalCounter}</span>
                </div>
                <Link
                    href={{
                        pathname: "/main/basket/Basket",
                        query: { basket: JSON.stringify(basket, replacer) },
                    }}
                >
                    <button className="basket" />
                </Link>
            </div>
        </header>
    );
}
