import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import app from "./firebase.init";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";

const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleEmailBlur = (e) => {
    const email = e.target.value;
    setEmail(email);
  };
  const handlePasswordBlur = (e) => {
    const pass = e.target.value;
    setPass(pass);
  };
  const handleRegisteredChange = (e) => {
    const check = e.target.checked;
    setRegistered(check);
    console.log(registered);
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    setValidated(true);
    setError("");
    if (registered) {
      signInWithEmailAndPassword(auth, email, pass)
        .then((result) => {
          const user = result.user;
          console.log(user);
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, pass)
        .then((result) => {
          const user = result.user;
          console.log(user);
          setEmail("");
          setPass("");
          sendVEmail();
        })
        .catch((error) => {
          const msg = error.message;
          alert(msg);
        });
    }
    event.preventDefault();
  };

  const sendVEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      console.log("email send");
    });
  };

  const handleforgetPass = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("email sent");
      })
      .catch((error) => {
        console.log(error.message);
        // ..
      });
  };

  return (
    <div className="container">
      <Form
        noValidate
        validated={validated}
        className="mt-5 w-50 mx-auto"
        onSubmit={handleFormSubmit}
      >
        <h2>Please {registered ? "login" : "register"}</h2>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onBlur={handleEmailBlur}
            type="email"
            placeholder="Enter email"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onBlur={handlePasswordBlur}
            type="password"
            placeholder="Password"
            required
          />
          <p className="text-danger">{error}</p>
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            onChange={handleRegisteredChange}
            type="checkbox"
            label="Already have an account"
          />
        </Form.Group>
        <Button onClick={handleforgetPass} variant="link">
          Forget Pass?
        </Button>
        <br />
        <Button variant="primary" type="submit">
          {registered ? "Log In" : "Register"}
        </Button>
      </Form>
    </div>
  );
}

export default App;
