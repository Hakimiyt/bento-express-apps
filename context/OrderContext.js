import { createContext, useContext, useState } from "react";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const addRecentOrder = (order) => {
    setRecentOrders((orders) => [order, ...orders]);
  };

  return (
    <OrderContext.Provider
      value={{ cartItems, setCartItems, recentOrders, setRecentOrders, addRecentOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
