import { useContext, React } from "react";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import "../index.scss";
import AppContext from "../context";
import Info from "../components/info";

const Favorites = () => {
  const {favoriteItems, onAddToFavorite, onAddToCart} = useContext(AppContext); //Context API
  return (
    <div className="content p-40">
      <div className="d-flex align-center mb-40">
        <Link to="/">
          <img
            className="cu-p mr-20"
            src="/img/close-favorite.svg"
            alt="On main"
            width={35}
            height={35}
          />
        </Link>
        <h1>My bookmarks</h1>
      </div>
      {favoriteItems.length > 0 ? (
        <div className="d-flex flex-wrap">
          {favoriteItems.map((item, index) => (
            <Card
              key={index}
              onCart={(obj) => onAddToCart(obj)}
              onFavorite={onAddToFavorite}
              favorited={true}
              {...item} //передаем весь item id title price imgUrl как в Home.jsx,  передаем id в кард для того чтобы удалить добавить в избранное кнопка сердце
            />
          ))}
        </div>
      ) : (
		<Info width="70" height="70" image="/img/nothing-in-favorites.png" description="Nothing added to favorites"/>
      )}
    </div>
  );
};

export default Favorites;
