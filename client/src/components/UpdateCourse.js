import React, { Component } from 'react';
import CourseForm from './CourseForm';

export default class UpdateCourse extends Component {
    state = {
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        errors: []
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
                                <label for="title">Course Title</label>
                                <input 
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={title}
                                    onChange={this.change}
                                />
                                <label for="description">Course Description</label>
                                <textarea 
                                    id="description"
                                    name="description"
                                    type="textarea"
                                    value={description}
                                    onChange={this.change}
                                />
                            </div>
                            <div>
                                <label for="estimatedTime">Estimated Time</label>
                                <input
                                    id="estimatedTime"
                                    name="estimatedTime"
                                    type="text"
                                    value={estimatedTime}
                                    onChange={this.change}
                                />
                                <label for="materialsNeeded">Materials Needed</label>
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