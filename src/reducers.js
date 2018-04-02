import { combineReducers } from 'redux'; 
import todos from './todoreducer';

const TodoReducers = combineReducers({
  todos
})

export default TodoReducers