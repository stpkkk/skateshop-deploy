//TODO slider
//TODO animation with motion
//TODO dark theme
//TODO login
//TODO json placeholder service
//TODO pagination
//TODO useReducer
import React, { useEffect, useState } from "react";
import axios from "axios";
import Drawer from "./components/Drawer";
import Header from "./components/Header";
import Favorites from "./pages/Favorites";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import AppContext from "./context";

function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [cartOpened, setCartOpened] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //  useEffect с помощью promise.all, лучше пользоваться другим вариантом, т.к. promise.all делает сразу все три запроса в данном случае, что мб не очень удобно
  //  useEffect(() => {
  //     async function fetchData() {
  //       try {
  //         const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
  //           axios.get('https://60d62397943aa60017768e77.mockapi.io/cart'),
  //           axios.get('https://60d62397943aa60017768e77.mockapi.io/favorites'),
  //           axios.get('https://60d62397943aa60017768e77.mockapi.io/items'),
  //         ]);

  //         setIsLoading(false);
  //         setCartItems(cartResponse.data);
  //         setFavorites(favoritesResponse.data);
  //         setItems(itemsResponse.data);
  //       } catch (error) {
  //         alert('Ошибка при запросе данных ;(');
  //         console.error(error);
  //       }
  //     }

  //     fetchData();
  //   }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const cartResponse = await axios.get(
          "https://629f94fc461f8173e4ececc6.mockapi.io/cart"
        );
        const favoriteResponse = await axios.get(
          "https://629f94fc461f8173e4ececc6.mockapi.io/favorites"
        );
        const itemsResponse = await axios.get(
          "https://629f94fc461f8173e4ececc6.mockapi.io/decks"
        ); //сказали данные вытащи в любом порядке
        //но сохраняй информацию в state в след порядке:

        setIsLoading(false);

        setCartItems(cartResponse.data);
        setFavoriteItems(favoriteResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert("Ошибка при запросе данных ;(");
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const onClickCart = () => {
    setCartOpened(true);
  };

  const onCloseСart = () => {
    setCartOpened(false);
  };

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find(
        (item) => Number(item.parentId) === Number(obj.id)
      ); //найди parentId  равный id у обьекта
      if (findItem) {
        setCartItems(
          (prev) =>
            prev.filter((item) => Number(item.parentId) !== Number(obj.id)) //filter = найди этот обьект и отфильтруй его в state
        );
        await axios.delete(
          `https://629f94fc461f8173e4ececc6.mockapi.io/cart/${findItem.id}` // отправь запрос на удаление и из корзины удали найденный по id товар
        );
      } else {
        setCartItems((prev) => [...prev, obj]);
        const { data } = await axios.post(
          "https://629f94fc461f8173e4ececc6.mockapi.io/cart",
          obj
        );
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.parentId === data.parentId) {
              // data.id кот с бэка
              return {
                ...item,
                id: data.id, // возьми все данные item и замени item.id на id кот. с бэка и верни новый item
              };
            }
            return item; //иначе верни ИЗНАЧАЛЬНЫЙ item
          })
        );
      }
    } catch (error) {
      alert("Add to cart error");
      console.error(error);
    }
  }; //https://youtu.be/C_3ZT7j1_jc?t=7614

  const onRemoveItemCart = (id) => {
    try {
      axios.delete(`https://629f94fc461f8173e4ececc6.mockapi.io/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert("Delete from cart error");
      console.error(error);
    }
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (
        favoriteItems.find((favObj) => Number(favObj.id) === Number(obj.id))
      ) {
        axios.delete(
          `https://629f94fc461f8173e4ececc6.mockapi.io/favorites/${obj.id}`
        );
        setFavoriteItems((prev) =>
          prev.filter((item) => Number(item.id) !== Number(obj.id))
        );
      } else {
        const { data } = await axios.post(
          `https://629f94fc461f8173e4ececc6.mockapi.io/favorites`,
          obj
        ); // ждем делит запрос потом отправляем этот запрос, await говорит что сначала выполни пред запрос , т.е. с помощь. этого запроса берем обьект не с home.jsx а с бэкэнда и дальше отрисовываем его

        setFavoriteItems((prev) => [...prev, data]);
      }
    } catch (error) {
      alert("Could not be added to favorite");
      console.log(error);
    }
  }; //trycatch нужен чтобы отловить ошибку при вызове запроса, а без него не узнать когда эта ошибка произойдет

  //Search
  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const onClearSearchInput = () => {
    setSearchValue("");
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  }; // пробегаемся по массиву в корзине и уже в массиве корзины вытаскивать parentId и сверять его с id кот. будет передаваться в карточке

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        setCartItems,
        favoriteItems,
        onAddToFavorite,
        isItemAdded,
        onAddToCart,
        setCartOpened,
        onCloseСart,
      }}
    >
      <div className="wrapper clear">
        <Drawer
          items={cartItems}
          onCloseCart={onCloseСart}
          onRemoveItemCart={onRemoveItemCart}
          opened={cartOpened}
        />
        <Header onClickCart={onClickCart} />
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Home
                cartItems={cartItems}
                items={items}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onClearSearchInput={onClearSearchInput}
                onAddToFavorite={onAddToFavorite}
                onAddToCart={onAddToCart}
                isLoading={isLoading}
                isItemAdded={isItemAdded}
              />
            }
          />
          <Route path="/favorites" exact element={<Favorites />} />
          <Route path="/orders" exact element={<Orders />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
