import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { loadCourses, saveCourse } from '../../redux/actions/courseActions'
import { loadAuthors } from '../../redux/actions/authorActions'
import PropTypes from 'prop-types'
import CourseForm from './CourseForm'
import Spinner from '../common/Spinner'

const initCourseState = {
  id: null,
  title: '',
  authorId: null,
  category: ''
}

const ManageCoursesPage = ({
  courseOnPage,
  courses,
  authors,
  loadAuthors,
  loadCourses,
  saveCourse,
  history
}) => {
  // hold  local form state
  const [course, setCourse] = useState({ ...courseOnPage })
  // hold errors
  const [errors, setErrors] = useState({})
  // hold form saving status
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (courses.length === 0) {
      loadCourses().catch(error => {
        alert('Loading courses failed' + error)
      })
    } else {
      setCourse({ ...courseOnPage })
    }
    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert('Loading authors failed' + error)
      })
    }
  }, [courseOnPage])

  const handleChange = event => {
    const { name, value } = event.target
    // [name] is Computed Property Names syntax from ES6
    setCourse(prevCourse => ({
      ...prevCourse,
      // if it is authorId, then we need to cast authorId from str to int
      [name]: name === 'authorId' ? parseInt(value, 10) : value
    }))
  }

  const handleSave = event => {
    setSaving(prev => !prev)
    event.preventDefault()
    // start redirecting when save finished
    saveCourse(course).then(() => {
      history.push('/courses')
    })
  }

  return courses.length === 0 || authors.length === 0 ? (
    <Spinner />
  ) : (
    <CourseForm
      course={course}
      errors={errors}
      authors={authors}
      onChange={handleChange}
      onSave={handleSave}
      saving={saving}
    />
  )
}

ManageCoursesPage.propTypes = {
  courseOnPage: PropTypes.object.isRequired,
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  loadCourses: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  saveCourse: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
}

const getCourseBySlug = (courses, slug) =>
  courses.find(course => course.slug === slug) || null

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { slug }
    }
  } = ownProps
  // if has slug and state.courses is loaded
  const courseOnPage =
    slug && state.courses.length > 0
      ? getCourseBySlug(state.courses, slug)
      : initCourseState
  return {
    courseOnPage,
    courses: state.courses,
    authors: state.authors
  }
}

const mapDispatchToProps = {
  loadCourses,
  loadAuthors,
  saveCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageCoursesPage)
