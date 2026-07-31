import type { Design } from "../../types"

export const ADD_TO_CART="ADD_TO_CART";
export const REMOVE_FROM_CART="REMOVE_FROM_CART"
export const EMPTY_CART="EMPTY_CART"

export const addToCartAction=(design: Design)=>{
    return{
        type: ADD_TO_CART,
        payload: design
    }
}

export const removeFromCartAction=(design:Design)=>{
    return{
        type:REMOVE_FROM_CART,
        payload: design
    }
}

export const emptyCartAction =()=>{
    return {type:EMPTY_CART}
}