import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { loadCourses, saveCourse } from '../../redux/actions/courseActions'
import { loadAuthors } from '../../redux/actions/authorActions'
import PropTypes from 'prop-types'
import CourseForm from './CourseForm'
import Spinner from '../common/Spinner'
import { toast } from 'react-toastify'

const initCourseState = {
  id: null,
  title: '',
  authorId: null,
  category: ''
}

const ManageCoursesPage = ({
  courses,
  authors,
  loadAuthors,
  loadCourses,
  saveCourse,
  history,
  ...props
}) => {
  // hold  local form state
  const [course, setCourse] = useState({ ...props.course })
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
      setCourse({ ...props.course })
    }
    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert('Loading authors failed' + error)
      })
    }
  }, [props.course])

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
    event.preventDefault()
    if (!formIsValid()) return
    setSaving(true)

    // start redirecting when save finished
    saveCourse(course)
      .then(() => {
        history.push('/courses')
        toast.success('Course saved!')
      })
      .catch(err => {
        setSaving(false)
        setErrors({ onSave: err.message })
      })
  }

  const formIsValid = () => {
    const { title, authorId, category } = course
    const errors = {}

    if (!title) errors.title = 'Title is required.'
    if (!authorId) errors.author = 'Author is required'
    if (!category) errors.category = 'Category is required'

    setErrors(errors)
    // Form is valid if the errors object still has no properties
    return Object.keys(errors).length === 0
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
  course: PropTypes.object.isRequired,
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
  const course =
    slug && state.courses.length > 0
      ? getCourseBySlug(state.courses, slug)
      : initCourseState
  return {
    course,
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
