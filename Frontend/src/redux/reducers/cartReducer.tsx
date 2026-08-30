import { mockDesigns } from "../../mockData/mockDesigns";
import type { CartAction, CartContentState } from "../../types";
import { ADD_TO_CART, REMOVE_FROM_CART, EMPTY_CART } from "../actions";

const initialState:CartContentState={
    content:[]
}

const cartReducer=(cartState=initialState, cartAction:CartAction):CartContentState=>{
switch(cartAction.type){
    // ADD NEW DESIGN TO SAVED ARRAY 
case ADD_TO_CART: {
if (!cartAction.payload || cartState.content.some((cartItem)=>cartItem.designId===cartAction.payload)) return cartState;
const design= mockDesigns.find((item)=>item.id===cartAction.payload)
if(!design) return cartState;
return {...cartState,
    content: [...cartState.content, {designId:design?.id, priceSnapshot:design?.price}]}}
    // REMOVE DESIGN FROM SAVED ARRAY
    case REMOVE_FROM_CART:
        return{
            ...cartState,
            content: cartState.content.filter(cartItem=>cartAction.payload? cartItem.designId!==cartAction.payload: cartItem)
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