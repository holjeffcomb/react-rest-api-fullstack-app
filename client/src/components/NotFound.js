import React from 'react';
import {Link} from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="wrap">
      <h2>Page Not Found</h2>
      <p>Sorry. The requested page could not be found.</p>
      <Link className="button" to="/">Return to Course Listing</Link>
    </div>
  )
}