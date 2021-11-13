import React, { Component } from 'react';
import CourseForm from './CourseForm';

export default class UpdateCourse extends Component {
    constructor(props) {
		super(props);
		this.state = {
            courseTitle: '',
            courseDescription: '',
            estimatedTime: '',
            materialsNeeded: '',
            userId: '',
            errors: [],
		    loading: false,
		};
    }

    componentDidMount() {
        const { context } = this.props;
        const user = context.authenticatedUser;

        this.setState({ loading: true });
        fetch(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
            .then(response => response.json())
            .then(data => {
                this.setState( {
                    courseTitle: data.course.title,
                    courseDescription: data.course.description,
                    estimatedTime: data.course.estimatedTime,
                    materialsNeeded: data.course.materialsNeeded,
                    userId: data.course.Owner.id,
                    loading: false
                });
                if (user.id !== this.state.userId) {
                    this.props.history.replace('/forbidden'); //replace used so user can't navigate back to same forbidden page. 
                }
            })
            .catch((err) => {
                console.log('Error fetching and parsing data', err);
                this.props.history.push('/notfound');
            });
    }   
    
    render() {
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            errors
        } = this.state;

        return(
            <div className="wrap">
                <h2>Update Course</h2>
                <CourseForm 
                    cancel={this.cancel}
                    errors={errors}
                    submit={this.submit}
                    submitButtonText="Create Course"
                    elements={() => (
                        <React.Fragment>
                            <div>
                                <label htmlFor="title">Course Title</label>
                                <input 
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={title}
                                    onChange={this.change}
                                />
                                <label htmlFor="description">Course Description</label>
                                <textarea 
                                    id="description"
                                    name="description"
                                    type="textarea"
                                    value={description}
                                    onChange={this.change}
                                />
                            </div>
                            <div>
                                <label htmlFor="estimatedTime">Estimated Time</label>
                                <input
                                    id="estimatedTime"
                                    name="estimatedTime"
                                    type="text"
                                    value={estimatedTime}
                                    onChange={this.change}
                                />
                                <label htmlFor="materialsNeeded">Materials Needed</label>
                                <textarea
                                    id="materialsNeeded"
                                    name="materialsNeeded"
                                    type="textarea"
                                    value={materialsNeeded}
                                    onChange={this.change}
                                />
                            </div>
                        </React.Fragment>
                    )}
                />
            </div>
        )   
    }

    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(() => {
            return {
                [name]: value
            }
        })
    }

    submit = () => {
        const { context } = this.props;

        const {
            title,
            description,
            estimatedTime,
            materialsNeeded
        } = this.state;
        
        const course = {
            title,
            description,
            estimatedTime,
            materialsNeeded
        }

        context.data.updateCourse(course)
            .then( errors => {
                if (errors.length) {
                    this.setState({ errors });
                } else {
                    // create course
                }
            })
            .catch( err => {
                console.log(err);
                this.props.history.push('/error');
            })
    }

    cancel = () => {
        this.props.history.push('/');
    }
}