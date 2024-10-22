import React from "react";
import { Link } from "react-router-dom";

const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    status,
    company,
    location,
    skills,
  },
}) => {
  return (
    <div className="profile bg-light">
      <img src={avatar} alt="" className="rounf-img" />
      <div>
        <h2>{name}</h2>
        <p>
          {status} {company && <span> at {company}</span>}
        </p>
        <p className="my-1">{location && <span> {location}</span>}</p>
        <Link className="btn btn-primary" to={`/profile/${_id}`}>View Profile</Link>
      </div>
      <ul>
          {skills.map((skill,index) => (
            <li style={{color:'green'}} key={index}>
            <i className="fas fa-check"></i>{skill}</li>
          ))}
        </ul>
    </div>
  );
};


export default ProfileItem;
