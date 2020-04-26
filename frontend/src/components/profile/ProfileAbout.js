import React from "react";

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user: { name },
  },
}) => {
  return (
    <div className="profile-about bg-light p-2">
      {bio && (
        <>
          {" "}
          <h2 className="text-primary">{name}</h2>
          <p>{bio}</p>
          <div className="line"></div>
        </>
      )}
      <div className="skills">
        {skills.map((skill, index) => (
          <div key={index} className="p-1">
            <i className="fa fa-check"></i>
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};


export default ProfileAbout;
