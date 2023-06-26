import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { BasketContext } from "../_app";

export default function Header() {
    const [totalCounter, setTotalCounter] = useState(0);
    const {basket} = useContext(BasketContext);

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
                    }}
                >
                    <button className="basket" />
                </Link>
            </div>
        </header>
    );
}
