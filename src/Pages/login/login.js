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
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import { useForm } from "../../hooks/hooks";
import { Colors } from "../../utils/theme";
const useStyles = makeStyles({
  Paper: {
    backgroundColor: "#e8f4fd",
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

const LOGIN_USER = gql`
  mutation ($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      username
      token
      email
      createdAt
    }
  }
`;

const Login = () => {
  const classes = useStyles();
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const matches = useMediaQuery("(max-width:600px)");
  const { onChange, onSubmit, values } = useForm(userLogin, {
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [login, { data, loading, error, called }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      navigate("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: {
      loginInput: values,
    },
  });
  function userLogin() {
    login();
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
            LOGIN
          </Typography>
          <TextField
            style={{
              marginTop: 15,
              maxWidth: 400,
            }}
            label="Username"
            name="username"
            type="text"
            color={errors && errors.username ? "error" : "secondary"}
            onChange={onChange}
          />
          <TextField
            style={{
              marginTop: 15,
              maxWidth: 400,
            }}
            label="Password"
            name="password"
            type="password"
            color={errors && errors.password ? "error" : "secondary"}
            onChange={onChange}
          />
          <Button
            style={{
              marginTop: 15,
              maxWidth: 400,
            }}
            color="secondary"
            variant="contained"
            onClick={onSubmit}
          >
            submit
          </Button>
          <Typography variant="body2" style={{ marginTop: 10 }}>
            Don't have an account? <Link to="/register">Register</Link>
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
