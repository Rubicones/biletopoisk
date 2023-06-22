import Link from "next/link";
import { useEffect, useState } from "react";

interface headerProps {
    basket: Map<string, number>;
}
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
export default function Header({ basket }: headerProps) {
    const [totalCounter, setTotalCounter] = useState(0);


    useEffect(() => {
        if (basket) {
            let counter = 0

            basket.forEach((value) => {
                counter += value
            })
            setTotalCounter(counter);
        }
        
    }, [basket])

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
                        pathname: "/basket/Basket",
                        query: { basket: JSON.stringify(basket, replacer) },
                    }}
                >
                    <button className="basket" />
                </Link>
            </div>
        </header>
    );
}
