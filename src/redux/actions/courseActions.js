import * as types from './actionTypes'
import * as courseApi from '../../api/courseApi'

export function loadCourseSuccess(courses) {
  return { type: types.LOAD_COURSES_SUCCESS, courses }
}

export function updateCourseSuccess(course) {
  return { type: types.UPDATE_COURSES_SUCCESS, course }
}

export function createCourseSuccess(course) {
  return { type: types.CREATE_COURSES_SUCCESS, course }
}

export function loadCourses() {
  return function(dispatch) {
    return courseApi
      .getCourses()
      .then(courses => {
        dispatch(loadCourseSuccess(courses))
      })
      .catch(error => {
        throw error
      })
  }
}

// if course.id exists, then means it is an update
export function saveCourse(course) {
  return function(dispatch) {
    return courseApi
      .saveCourse(course)
      .then(savedCourse => {
        course.id
          ? dispatch(updateCourseSuccess(savedCourse))
          : dispatch(createCourseSuccess(savedCourse))
      })
      .catch(error => {
        throw error
      })
  }
}