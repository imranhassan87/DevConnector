import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import { deleteExperiance } from "../../actions/profile";

const Experiance = ({ experiance, deleteExperiance }) => {
  const experiances = experiance.map((exp) => {
    return (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td className="hide-sm">{exp.title}</td>
        <td>
          <Moment format="YYYY/MM/DD">{exp.from}</Moment> -{" "}
          {exp.to === null ? (
            " Now"
          ) : (
            <Moment format="YYYY/MM/DD">{exp.to}</Moment>
          )}
        </td>
        <td>
          <button
            onClick={() => {
              deleteExperiance(exp._id);
            }}
            className="btn btn-danger"
          >
            Detele
          </button>
        </td>
      </tr>
    );
  });
  return (
    <>
      <h2 className="my-2">Experiance Credientials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{experiances}</tbody>
      </table>
    </>
  );
};

Experiance.propTypes = {
  experiance: PropTypes.array.isRequired,
  deleteExperiance: PropTypes.func.isRequired,
};

export default connect(null,{deleteExperiance})(Experiance);
