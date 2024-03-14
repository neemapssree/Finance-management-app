import { createSlice } from "@reduxjs/toolkit";
const INITIAL_STATE = {
    userDetails: JSON.parse(localStorage.getItem('user')) ?? {},   //to set the initial states from local storage when page refresh
}

const generalSlice = createSlice({                      //Similar as [state, setState]=useState(); method
    name: 'user',
    initialState:INITIAL_STATE,
    reducers:{
        setUserDetails:(state,action)=>{
            state.userDetails=action.payload;
        },
    }
})

export const {setUserDetails, setUserRole}=generalSlice.actions  //exporting reducers
export default generalSlice.reducer