import { React, useEffect, useState } from "react";
import Card from "../components/Card";
import "../index.scss";
import { Link } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "https://629f94fc461f8173e4ececc6.mockapi.io/orders"
        );
        setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []));
        setIsLoading(false);
      } catch (error) {
        alert("Error to get an orders");
        console.error(error);
      }
    })();
  }, []);

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
        <h1>My orders:</h1>
      </div>

      <div className="d-flex flex-wrap">
        {(isLoading ? [...Array(8)] : orders).map((item, index) => (
          <Card key={index} loading={isLoading} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
