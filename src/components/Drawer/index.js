import { React, useState } from "react";

import axios from "axios";
import Info from "../info";

import { useCart } from "../../hooks/useCart";

import "../../index.scss";
import styles from "./Drawer.module.scss";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // костыль для mockapi

const Drawer = ({ onCloseCart, items = [], onRemoveItemCart, opened }) => {
  const [orderId, setOrderId] = useState(null); // номер заказа
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const { cartItems, setCartItems, totalPrice } = useCart(); //кастомный хук
  const [isLoading, setIsLoading] = useState(false); //true дб, 7 урок 3.10 часа

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "https://629f94fc461f8173e4ececc6.mockapi.io/orders",
        { items: cartItems }
      ); // долго искал ошибку, забыл await перед axios.post

      setOrderId(data.id);
      setIsOrderComplete(true);
      setCartItems([]);
      //при на Order нажатии отправляю cartItems в бэк возвращаем пустой массив и благодаря этому корзина очищается

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete(
          "https://629f94fc461f8173e4ececc6.mockapi.io/cart/" + item.id
        );
        await delay(1000);
      } //костыль для mockapi (ждем 1сек до след действия)
    } catch (error) {
      alert("Failed to create order :( ");
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ""}`}>
      <div className={styles.drawer}>
        <h2 className="d-flex justify-between mb-20">
          Cart
          <img
            onClick={onCloseCart}
            className={styles.removeBtn}
            src="img/btn-remove.svg"
            alt="Close"
          />
        </h2>

        {items.length > 0 ? (
          <>
            <div className={styles.cartItems}>
              {items.map((obj, index) => (
                <div className={styles.cartItem} key={index}>
                  <img src={obj.imageUrl} width={80} height={80} alt="Deck" />
                  <div className="mr-20">
                    <p className="mb-5">{obj.title}</p>
                    <b>{obj.price} USD</b>
                  </div>

                  <img
                    onClick={() => onRemoveItemCart(obj.id)}
                    className={styles.removeBtn}
                    src="img/btn-remove.svg"
                    alt="Remove"
                  />
                </div>
              ))}
            </div>
            <div className={styles.cartTotalBlock}>
              <ul>
                <li>
                  <span>Total:</span>
                  <div></div>
                  <b>{totalPrice.toFixed(2)} USD</b>
                </li>
                <li>
                  <span>Tax 13%:</span>
                  <div></div>
                  <b>{(totalPrice * 0.13).toFixed(2)} USD</b>
                </li>
              </ul>
              <button
                disabled={isLoading}
                onClick={onClickOrder}
                className="greenButton"
              >
                Order
                <img
                  src="img/arrow-right.svg"
                  width={13}
                  height={13}
                  alt="Order"
                />
              </button>
            </div>
          </>
        ) : (
          <Info
            title={
              isOrderComplete ? "Congrats! Order complete!" : "Cart is Empty!"
            }
            description={
              isOrderComplete
                ? `Your order #${orderId} will be delivered to courier soon`
                : "Add some stuff in cart to make an order!"
            }
            image={
              isOrderComplete ? "img/order-complete.jpg" : "img/empty-cart.png"
            }
            width={isOrderComplete ? "83" : "120"}
            height="120"
          />
        )}
      </div>
    </div>
  );
};

export default Drawer;
