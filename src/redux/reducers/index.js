import { combineReducers } from 'redux'
import courses from './courseReducer'
import authors from './authorReducer'
import apiCallInProgress from './apiCallReducer'

const rootReducer = combineReducers({
  courses,
  authors,
  apiCallInProgress
})

export default rootReducer
