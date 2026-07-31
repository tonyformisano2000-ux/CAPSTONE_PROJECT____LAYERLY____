import type { CartAction, CartContentState } from "../../types";
import { ADD_TO_CART, REMOVE_FROM_CART, EMPTY_CART } from "../actions";
const initialState:CartContentState={
    content:[]
}

const cartReducer=(cartState=initialState, cartAction:CartAction)=>{
switch(cartAction.type){
    // ADD NEW DESIGN TO SAVED ARRAY 
case ADD_TO_CART: 
if (!cartAction.payload) return cartState;
return {...cartState,
    content: [...cartState.content, cartAction.payload] }
    // REMOVE DESIGN FROM SAVED ARRAY
    case REMOVE_FROM_CART:
        return{
            ...cartState,
            content: cartState.content.filter(cartItem=>cartAction.payload? cartItem.designId!==cartAction.payload.designId: cartItem)
        }
    // EPTY ALL CART DESIGNS
        case EMPTY_CART: 
        return{
            ...cartState, content:[]
        }
    //  DEFAULT RESPONSE: NO CHANGES  
    default: return cartState
}
}
export default cartReducer