import {
    UPDATE_LANGUAGE,
    DEFAULT_RETURN,
    REQUEST_FAILURE,
    POST_CRUD,
    REQUEST_INIT,
    IDLE_LOGOUT
} from '../actions/LoginTypes';

const initialState = {
    language: 'en-US',
    loading: false,
    navigation: 'login',
    masterData: {},
    masterStatus: "",
    errorStatus: "",
    idleneed:true,
    idleTimeout: 1000 * 60 * 10,
    sessionExpired: Date.now() + 60000,
    //inputParam:{}
    userInfo: {
        susername: '',
        suserrolename: ''
    },

}

const LoginReducer = (state = initialState, action) => {
    console.log('Login Reducer',action.payload);
    switch (action.type) {

        case REQUEST_INIT:
            return {
                ...state,
                loading: action.payload
            }

            case UPDATE_LANGUAGE:
                return {
                    ...state,
                    ...action.payload
                }

                case DEFAULT_RETURN:
                    // console.log("DEFAULT_RETURN action.payload:", action.payload);
                    return {
                        ...state,
                        ...action.payload
                    }

                    case REQUEST_FAILURE:
                        return {
                            ...state,
                            error: action.payload.error,
                                loading: action.payload.loading
                        }

                        case POST_CRUD:
                            // let {selectedId, filterValue} = state;            
                            // if (action.payload.operation === "create"){
                            //     selectedId =null;
                            //     //filterValue ="";
                            // }
                            return {
                                ...state,
                                ...action.payload,
                                    //selectedId//, filterValue
                            }
                            case IDLE_LOGOUT:
                                return{
                                    ...initialState,
                                    ...action.payload
                                }

                            default:
                                return state
    }
}

export default LoginReducer;