import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import format from "date-fns/format";

const styles = {
  paper: {
    margin: "20px"
  },
  card: {
    margin: "20px",
    maxWidth: 400
  },
  heading: {
    marginLeft: "20px",
    marginTop: "20px",
    paddingTop: "20px"
  },
  button: {
    paddingLeft: "20px"
  },
  text: {
    marginLeft: "20px",
    paddingBottom: "10px"
  }
};

const AssignmentsToGrade = ({
  user,
  assignment,
  course,
  studentAssignments,
  students,
  history,
  classes
}) => {
  return user ? (
    <Paper className={classes.paper}>
      <Typography variant="h4" className={classes.heading}>
        {assignment.name}
        <Button color="primary" onClick={() => history.goBack()}>
          Back
        </Button>
        <Button
          className={classes.button}
          color="primary"
          component={Link}
          to={`/course/${course.id}/assignment/${assignment.id}/edit`}
        >
          Edit
        </Button>
      </Typography>
      <Typography variant="h6" className={classes.text}>
        {`${course.name} - ${assignment.category} - ${
          assignment.points
        } points`}
      </Typography>
      <Typography variant="h6" className={classes.text}>
        {`Due on: ${format(assignment.due_date, "PPPP @ p")}`}
      </Typography>
      <Divider />
      <List>
        {studentAssignments
          ? studentAssignments.map(assignment => (
              <ListItem
                key={assignment.id}
                divider
                button
                component={Link}
                to={`/course/${course.id}/assignment/${
                  assignment.assignment_id
                }/grade/student/${assignment.student_id}`}
              >
                <ListItemText
                  primary={
                    students.find(
                      student => student.id === assignment.student_id
                    ).name
                  }
                  secondary={`Status: ${assignment.status
                    .split("_")
                    .join(" ")}`}
                />
              </ListItem>
            ))
          : null}
      </List>
    </Paper>
  ) : null;
};

const mapStateToProps = (state, ownProps) => {
  let assignment;
  let studentAssignments;
  let course;
  let students;
  if (state.user && state.user.person.teacher) {
    const assignmentId = parseInt(ownProps.match.url.split("/")[4]);
    assignment = state.user.person.teacher.assignments.find(
      assignment => assignment.id === assignmentId
    );
    course = state.user.person.teacher.courses.find(
      course => course.id === assignment.course_id
    );
    students = state.user.person.teacher.students;
    studentAssignments = state.user.person.teacher.student_assignments.filter(
      studentAssignment => studentAssignment.assignment_id === assignmentId
    );
  }
  return {
    user: state.user,
    assignment: assignment,
    course: course,
    students: students,
    studentAssignments: studentAssignments,
    history: ownProps.history
  };
};

export default withStyles(styles)(connect(mapStateToProps)(AssignmentsToGrade));
