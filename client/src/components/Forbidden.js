import React from 'react';
import {Link} from 'react-router-dom';

export default function Forbidden() {
  return (
    <div className="wrap">
      <h2>Forbidden</h2>
      <p>The request page is forbidden.</p>
      <Link className="button" to="/">Return to Course Listing</Link>
    </div>
  )
}