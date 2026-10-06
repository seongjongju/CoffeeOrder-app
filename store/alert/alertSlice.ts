import { createSlice } from '@reduxjs/toolkit';
interface AlertItem {
    id: string;
    userId: string;
    text: string;
};

interface AlertState {
    items: AlertItem[]
};

const initialState: AlertState = {
    items: []
};

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        addToAlert: (state, action) => {
            state.items.push({
                ...action.payload
            })
        },
        allDeleteAlert: (state) => {
            state.items = [];
        },
    },
});

export const {addToAlert, allDeleteAlert} = alertSlice.actions;
export default alertSlice.reducer;