import React from 'react';
import {Link} from 'react-router-dom';

export default function UnhandledError() {
  return (
    <div className="wrap">
      <h2>Error</h2>
      <p>Sorry! We've just encountered an unexpected error.</p>
      <Link className="button" to="/">Return to Course Listing</Link>
    </div>
  )
}