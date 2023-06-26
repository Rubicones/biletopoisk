"use client";

import Image from "next/image";
import dropdown from "../../../resources/icons/dropdown.svg";
import React, {
    useState,
    useEffect,
    useContext,
    useCallback,
    createContext,
} from "react";


interface filterProps {
    name: string;
    placeholder: string;
    isDropdown: boolean;
    dropdownItems?: { id: number; name: string }[];
    onFilterStringInput: (str: string) => void;
    onGenreFilterSet: (str: string) => void;
    onCinemaFilterSet: (str: string) => void;
}

const Filter = ({
    name,
    placeholder,
    isDropdown,
    dropdownItems,
    onFilterStringInput,
    onGenreFilterSet,
    onCinemaFilterSet,
}: filterProps) => {
    const [inputValue, setInputValue] = useState("");
    const {activeFilter, switchActiveFilter} = useContext(FiltersContext)

    const handleDropdownItemClick = (item: string) => {
        if (name === "Жанр") onGenreFilterSet(item);
        if (name === "Кинотеатр") onCinemaFilterSet(item);
        setInputValue(item);
        switchActiveFilter("")
    };

    const handleDropdownClick = () => {
        switchActiveFilter(name)
    };

    return (
        <>
            <div className="filter-container">
                <label htmlFor="filter">{name}</label>
                <div className="input-container">
                    {isDropdown ? (
                        <input
                            type="text"
                            className="filter"
                            placeholder={placeholder}
                            value={inputValue}
                            readOnly
                        />
                    ) : (
                        <input
                            type="text"
                            className="filter"
                            placeholder={placeholder}
                            onInput={(e) => {
                                onFilterStringInput(e.currentTarget.value);
                            }}
                        />
                    )}

                    {isDropdown && (
                        <div
                            className="dropdown-container"
                            onClick={handleDropdownClick}
                        >
                            <Image
                                className="dropdown-btn"
                                src={dropdown}
                                alt="dropdown button"
                                width={18}
                                height={18}
                            />
                        </div>
                    )}
                </div>
                {activeFilter === name && (
                    <ul className="dropdown-list">
                        {dropdownItems?.map((item) => (
                            <li
                                key={item.id}
                                onClick={() =>
                                    handleDropdownItemClick(item.name)
                                }
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

interface filtersProps {
    onFilterStringInput: (str: string) => void;
    onGenreFilterSet: (str: string) => void;
    onCinemaFilterSet: (str: string) => void;
}

const FiltersContext = createContext<{
    activeFilter: string,
    switchActiveFilter: (filter: string) => void;
}>({activeFilter: '', switchActiveFilter: () => {}})

const Filters = ({
    onFilterStringInput,
    onGenreFilterSet,
    onCinemaFilterSet,
}: filtersProps) => {
    let genres = [
        { id: 0, name: "Не выбран" },
        { id: 1, name: "Боевик" },
        { id: 2, name: "Комедия" },
        { id: 3, name: "Фэнтези" },
        { id: 4, name: "Ужасы" },
    ]
    const [cinemas, setCinemas] = useState([{ id: 0, name: "Не выбран" }]);
    const [activeFilter, setActiveFilter] = useState("");
    const switchActiveFilter = useCallback(
    (filter: string) => {
        setActiveFilter(activeFilter => {
            return activeFilter === filter ? '' : filter;
        });
    },
    //eslint-disable-next-line
    [activeFilter]
);
    useEffect(() => {
        let cinemasReq = fetch("http://localhost:3001/api/cinemas");
        cinemasReq
            .then((res) => res.json())
            .then((res) => setCinemas((arr) => [...arr, ...res]))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="filters-menu-container">
            <span>Фильтр поиска</span>
            <div className="filters-container">
                <FiltersContext.Provider value={{activeFilter, switchActiveFilter}}>
                    <Filter
                        name="Название"
                        placeholder="Введите название"
                        isDropdown={false}
                        onFilterStringInput={(str: string) => {
                            onFilterStringInput(str);
                        }}
                        onGenreFilterSet={(str: string) => {
                            onGenreFilterSet(str);
                        }}
                        onCinemaFilterSet={(str: string) => {
                            onCinemaFilterSet(str);
                        }}
                    />
                    <Filter
                        name="Жанр"
                        placeholder="Выберите жанр"
                        isDropdown={true}
                        dropdownItems={genres}
                        onFilterStringInput={(str: string) => {
                            onFilterStringInput(str);
                        }}
                        onGenreFilterSet={(str: string) => {
                            onGenreFilterSet(str);
                        }}
                        onCinemaFilterSet={(str: string) => {
                            onCinemaFilterSet(str);
                        }}
                    />
                    <Filter
                        name="Кинотеатр"
                        placeholder="Выберите кинотеатр"
                        isDropdown={true}
                        dropdownItems={cinemas}
                        onFilterStringInput={(str: string) => {
                            onFilterStringInput(str);
                        }}
                        onGenreFilterSet={(str: string) => {
                            onGenreFilterSet(str);
                        }}
                        onCinemaFilterSet={(str: string) => {
                            onCinemaFilterSet(str);
                        }}
                    />
                </FiltersContext.Provider>
            </div>
        </div>
    );
};
export default Filters;
