export const ADD_TO_CART="ADD_TO_CART";
export const REMOVE_FROM_CART="REMOVE_FROM_CART"
export const EMPTY_CART="EMPTY_CART"

export const addToCartAction = (id: string) => {
  return {
    type: ADD_TO_CART,
    payload: id,
  };
};

export const removeFromCartAction=(id:string)=>{
    return{
        type:REMOVE_FROM_CART,
        payload: id
    }
}

export const emptyCartAction =()=>{
    return {type:EMPTY_CART}
}