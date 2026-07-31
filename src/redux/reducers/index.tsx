import type {MainAction, Mainstate} from "../../types/index"

const initialState:Mainstate={
    main:{
        count:0
    }
}
const mainReducer=(state=initialState, action: MainAction)=>{
    switch(action.type){
        default:return state
    }
}
export default mainReducer