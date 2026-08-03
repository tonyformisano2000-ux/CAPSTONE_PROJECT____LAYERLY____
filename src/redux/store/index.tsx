import{combineReducers, configureStore} from "@reduxjs/toolkit"
import cartReducer from "../reducers/cartReducer"
import {persistStore, persistReducer} from "redux-persist"
import localStorage from "redux-persist/es/storage"
// ADD NEW REDUCERS HERE 
const mainReducer= combineReducers({
    cart: cartReducer
})

// __REDUX PERSIST__
const persistConfig={
    storage:localStorage,
    key: "root"
    // "ROOT" INDICA CHE STIAMO SALVANDO TUTTI I DATI DELLO STATE, MA SI POSSONO SELEZIONARE ANCHE "SLICES" SPECIFICHE
}

const persistedReducer = persistReducer(persistConfig, mainReducer) 

const store= configureStore({
    reducer: persistedReducer})

const persistedStore=persistStore(store)

export {store, persistedStore}

