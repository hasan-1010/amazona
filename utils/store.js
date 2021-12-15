import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';

export const Store = createContext();
const initialState = {
    darkMode: Cookies.get('darkMode') == 'ON' ? true : false,
    cart: {
        cartItems: Cookies.get('cartItems')
            ? JSON.parse(Cookies.get('cartItems'))
            : [],
        shippingInfo: Cookies.get('shippingInfo')
            ? JSON.parse(Cookies.get('shippingInfo'))
            : null,
        paymentMethod: Cookies.get('paymentMethod')
            ? Cookies.get('paymentMethod')
            : '',
    },
    userInfo: Cookies.get('userInfo')
        ? JSON.parse(Cookies.get('userInfo'))
        : null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'DARK_MODE_ON':
            return { ...state, darkMode: true };
        case 'DARK_MODE_OFF':
            return { ...state, darkMode: false };
        case 'CART_ADD_ITEM': {
            const newItem = action.payload;
            const existItem = state.cart.cartItems.find(
                (item) => item._id === newItem._id
            );
            const cartItems = existItem
                ? state.cart.cartItems.map((item) =>
                      item._id === existItem._id ? newItem : item
                  )
                : [...state.cart.cartItems, newItem];
            Cookies.set('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        }
        case 'CART_REMOVE_ITEM': {
            const removedItem = action.payload;
            const cartItems = state.cart.cartItems.filter(
                (item) => removedItem._id !== item._id
            );
            Cookies.set('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        }
        case 'CART_CLEAR': {
            Cookies.remove('CartItems');
            return { ...state, cart: { ...state.cart, cartItems: [] } };
        }
        case 'SAVE_SHIPPING_INFO': {
            Cookies.set('shippingInfo', JSON.stringify(action.payload));
            return {
                ...state,
                cart: { ...state.cart, shippingInfo: action.payload },
            };
        }
        case 'SAVE_PAYMENT_METHOD': {
            Cookies.set('paymentMethod', action.payload);
            return {
                ...state,
                cart: { ...state.cart, paymentMethod: action.payload },
            };
        }
        case 'USER_LOGIN': {
            Cookies.set('userInfo', JSON.stringify(action.payload));
            return { ...state, userInfo: action.payload };
        }
        case 'USER_LOGOUT': {
            return {
                ...state,
                userInfo: null,
                cart: {
                    cartItems: [],
                    shippingInfo: null,
                    paymentMethod: null,
                },
            };
        }
        case 'USER_REGISTER': {
            Cookies.set('userInfo', JSON.stringify(action.payload));
            return { ...state, userInfo: action.payload };
        }
        default:
            return state;
    }
}

export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children}</Store.Provider>;
}