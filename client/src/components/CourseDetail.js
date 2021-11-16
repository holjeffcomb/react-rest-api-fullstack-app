import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default class CourseDetail extends Component {
    constructor(props) {
		super(props);
        this.state = {
            course: [],
            courseOwner: [],
            loading: false,
            id: this.props.match.params.id,
		};
    }

    // check existence of course upon mounting
    componentDidMount() {
        const id = this.props.match.params.id;
		this.setState({ loading: true });
		fetch(`http://localhost:5000/api/courses/${this.state.id}`)
		  .then(response => {
            if (response.status === 404) {
                this.props.history.push('/notfound');
            } else if (response.status === 500 ) {
                this.props.history.push('/error');
            } else {
                return response.json()
            }
          })
		  .then(data => {
            try {
                this.setState( 
                    {
                        course: data.course,
                        courseOwner: data.course.Owner,
                        loading: false,
                        id: id
                    }
                )
            } catch (err) {
                this.props.history.push('/error');
            }
          });
	  }

    // inactive function to parse list of materials
    parseMaterials = (materials) => {
        return materials.replaceAll('*','').split('\n').map(function(material){
            return <li>{material}</li>
        });
    }

    // delete course
    deleteCourseHandler = async () => {
        const { context } = this.props;
        const authenticatedUser = context.authenticatedUser;
        await context.data.deleteCourse(this.props.match.params.id, authenticatedUser.emailAddress, authenticatedUser.password);
        this.props.history.push('/');
    }
    
    render() {

        const course = this.state.course;
        const { context } = this.props;
        const authenticatedUser = context.authenticatedUser;
        const courseOwner = this.state.courseOwner;

        if (course) {
            return(
                <div>
                    <div className="actions--bar">
                        <div className="wrap">
                            {/* Only shows update course and delete course buttons if user is authenticated && matches course owner. */}
                            {(authenticatedUser && authenticatedUser.id === courseOwner.id) ? 
                                (
                                    <React.Fragment>
                                        <Link className="button" to={`/courses/${this.state.id}/update`}>Update Course</Link>
                                        <button className="button" href="#" onClick={this.deleteCourseHandler}>Delete Course</button>
                                    </React.Fragment> 
                                ) : (
                                    null
                                )
                            }  
                        </div>
                    </div>
                    
                    <div className="wrap">
                        <h2>Course Detail</h2>
                        <form>
                            <div className="main--flex">
                                <div>
                                    <h3 className="course--detail--title">Course</h3>
                                    <h4 className="course--name">{course.title}</h4>
                                    <p>By {courseOwner.firstName} {courseOwner.lastName}</p>
                                    <p>{course.description}</p>
                                </div>

                                <div>
                                    <h3 className="course--detail--title">Estimated Time</h3>
                                    <p>{course.estimatedTime}</p>

                                    <h3 className="course--detail--title">Materials Needed</h3>
                                    {
                                    course.materialsNeeded ? 

                                    <ul className="course--detail--list">
                                    <ReactMarkdown>
                                        {course.materialsNeeded}
                                    </ReactMarkdown>
                                    </ul>

                                    : 
                                    <div></div>
                                    }
                                    
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )
            
        } else {
            return (
                <h1>Loading...</h1>
            )
        }
    }
}