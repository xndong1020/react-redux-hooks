import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { loadCourses } from '../../redux/actions/courseActions'
import { loadAuthors } from '../../redux/actions/authorActions'
import PropTypes from 'prop-types'
import CourseList from './CourseList'

class CoursesPage extends React.Component {
  componentDidMount() {
    const { courses, authors, loadCourses, loadAuthors } = this.props

    if (courses.length === 0) {
      loadCourses().catch(error => {
        alert('Loading courses failed' + error)
      })
    }

    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert('Loading authors failed' + error)
      })
    }
  }

  render() {
    return (
      <>
        <h2>Courses</h2>
        <Link to="/course" className="btn btn-info">
          Add Course
        </Link>
        <CourseList courses={this.props.courses} />
      </>
    )
  }
}

CoursesPage.propTypes = {
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  loadCourses: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    courses:
      state.authors.length === 0
        ? []
        : state.courses.map(course => {
            return {
              ...course,
              authorName: state.authors.find(a => a.id === course.authorId).name
            }
          }),
    authors: state.authors
  }
}

const mapDispatchToProps = {
  loadCourses,
  loadAuthors
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursesPage)
