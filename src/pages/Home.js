import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { useNavigate } from 'react-router-dom';
import qs from 'qs';

// import axios from 'axios';

import {
    setCategoryId,
    setCurrentPage,
    //setFilters,
} from '../redux/slices/filterSlice';
import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort from '../components/Sort';
import Pagination from '../components/Pagination';

import { SearchContext } from '../App';

import pizzas from '../pizzas.json';

function Home() {
    //const navigate = useNavigate();
    const dispatch = useDispatch();
    const { categoryId, sort, curentPage } = useSelector(
        (state) => state.filter
    );
    const sortType = sort.sortProperty;
    const { searchValue } = useContext(SearchContext);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const onClickCategory = (id) => {
        dispatch(setCategoryId(id));
    };

    const onChangePage = (number) => {
        dispatch(setCurrentPage(number));
    };

    // useEffect(() => {
    //     const queryString = qs.stringify({
    //         sortProperty: sortType,
    //         categoryId,
    //         curentPage,
    //     });

    //     navigate(`?${queryString}`);
    // }, [categoryId, sortType, curentPage]);

    useEffect(() => {
        setIsLoading(true);

        const sortBy = sortType.replace('-', '');
        const order = sortType.includes('-') ? 'asc' : 'desc';

        const category = categoryId > 0 ? `category=${categoryId}` : '';
        const search = searchValue > 0 ? `&search=${searchValue}` : '';

        // axios
        //     .get(
        //         `https://pizza.free.beeceptor.com/pizza?page=${curentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
        //     )
        //     .then((res) => {
        //         setItems(res.data);
        //         setIsLoading(false);
        //     });

        fetch(
            `https://pizza.free.beeceptor.com/pizza?page=${curentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
        )
            .then((res) => {
                res.json();
            })
            .then((arr) => {
                setItems(arr);
                setIsLoading(false);
            });

        window.scrollTo(0, 0);
    }, [categoryId, sortType, searchValue, curentPage]);

    const skeletons = [...new Array(6)].map((_, index) => (
        <Skeleton key={index} />
    ));

    const pizzaItem = pizzas
        .filter((obj) => {
            if (obj.title.toLowerCase().includes(searchValue.toLowerCase())) {
                return true;
            }
            return false;
        })
        .map((pizza) => <PizzaBlock key={pizza.id} {...pizza} />);

    return (
        <div className="container">
            <div className="content__top">
                <Categories
                    value={categoryId}
                    onClickCategory={onClickCategory}
                />
                <Sort />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">
                {isLoading ? skeletons : pizzaItem}
            </div>
            <Pagination curentPage={curentPage} onChangePage={onChangePage} />
        </div>
    );
}

export default Home;
