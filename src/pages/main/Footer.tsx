import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {          
    const [isVisible, setIsVisible] = useState(false);

    const scrollHandler = () => {
        const scrollPosition = document.body.scrollHeight - document.body.scrollTop;
        const bodyHeight = document.body.clientHeight;
        if (scrollPosition - 0.5 <= bodyHeight) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {        
        scrollHandler()    
        document.body.addEventListener("scroll", scrollHandler);
        return () => {
            document.body.removeEventListener("scroll", scrollHandler);
        };
    }, []);

    return (
        <footer className={isVisible === false ? "hidden" : "visible"}>
            <Link
                href={{
                    pathname: "/main/QnA/QnA",
                }}
            >
                <h3>Вопросы-ответы</h3>
            </Link>
            <Link
                href={{
                    pathname: "/main/about_us/AboutUs",
                }}
            >
                <h3>О нас</h3>
            </Link>
        </footer>
    );
}
