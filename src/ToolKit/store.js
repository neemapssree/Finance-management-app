import { configureStore } from "@reduxjs/toolkit";
import userReducer from './UserSlice';                   //this is not using now

export const store = configureStore({
    reducer:{
        user:userReducer,        
    }
})