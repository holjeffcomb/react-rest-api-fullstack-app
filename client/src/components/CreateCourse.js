import React, { Component } from 'react';
import CourseForm from './CourseForm';

export default class CreateCourse extends Component {
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
                <h2>Create Course</h2>
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
        const user = context.authenticatedUser;

        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
        } = this.state;
        
        const course = {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId: user.id
        }

        context.data.createCourse(course, user.emailAddress, user.password)
            .then( errors => {
                if (errors.length) {
                    this.setState({ errors });
                } else {
                    this.props.history.push("/");
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