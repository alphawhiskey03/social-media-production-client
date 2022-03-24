import {
  Paper,
  TextField,
  Container,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { gql, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth";
import PopAlert from "../../components/popAlert";
import { useForm } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { Colors } from "../../utils/theme";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  Paper: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    borderRadius: 15,
    marginTop: 100,
  },
  TextField: {
    marginTop: 15,
    maxWidth: 400,
  },
  Button: {
    marginTop: 15,
  },
});

const REGISTER_USER = gql`
  mutation ($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      username
      token
      email
      createdAt
    }
  }
`;
const Register = () => {
  const classes = useStyles();
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const matches = useMediaQuery("(max-width:600px)");
  const { onChange, onSubmit, values } = useForm(userRegister, {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [addUser, { data, loading, error, called }] = useMutation(
    REGISTER_USER,
    {
      update(_, { data: { register: userData } }) {
        context.login(userData);
        navigate("/");
      },
      onError(err) {
        console.log(err);
        setErrors(err.graphQLErrors[0].extensions);
      },
      variables: {
        registerInput: values,
      },
    }
  );
  function userRegister(e) {
    if (
      values.username.length > 0 &&
      values.password.length > 0 &&
      values.confirmPassword.length > 0 &&
      values.email.length > 0
    ) {
      addUser();
    }
  }

  return (
    <>
      <Container align="center" justify="center">
        <Paper
          className={classes.Paper}
          style={{
            backgroundColor: Colors.primary,
            width: matches ? 300 : 400,
          }}
          elevation={5}
        >
          <Typography variant="h5" align="left">
            REGISTER
          </Typography>
          <TextField
            className={classes.TextField}
            style={{
              marginTop: 15,
              maxWidth: 400,
            }}
            label="Username"
            name="username"
            color={errors && errors.username ? "error" : "secondary"}
            type="text"
            onChange={onChange}
          />
          <TextField
            className={classes.TextField}
            style={{
              marginTop: 15,
              maxWidth: 400,
            }}
            label="Password"
            name="password"
            color={errors && errors.password ? "error" : "secondary"}
            type="password"
            onChange={onChange}
          />
          <TextField
            className={classes.TextField}
            style={{
              marginTop: 15,
              maxWidth: 400,
            }}
            label="Confirm Password"
            name="confirmPassword"
            color={errors && errors.confirmPassword ? "error" : "secondary"}
            type="password"
            onChange={onChange}
          />
          <TextField
            className={classes.TextField}
            style={{
              marginTop: 15,
              maxWidth: 400,
            }}
            label="Email"
            name="email"
            color={errors && errors.email ? "error" : "secondary"}
            type="email"
            onChange={onChange}
          />
          <Button
            className={classes.Button}
            style={{
              marginTop: 15,
              maxWidth: 400,
            }}
            color="secondary"
            variant="contained"
            onClick={onSubmit}
          >
            {loading ? "loading..." : "submit"}
          </Button>
          <Typography variant="body2" style={{ marginTop: 10 }}>
            already have an account? <Link to="/login">login</Link>
          </Typography>
        </Paper>
        <PopAlert errors={errors} />
      </Container>
    </>
  );
};

export default Register;
