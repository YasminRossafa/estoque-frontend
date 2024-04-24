import './App.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Axios from 'axios';
import Home from './Home'; 
import React from 'react';

type UserSignup = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type UserLogin = {
  email: string;
  password: string;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); 

  const handleClickLogin = (values: UserLogin) => {
    Axios.post('http://localhost:5050/login', {
      email: values.email,
      password: values.password,
    }).then(response => {
      //alert(response.data.msg);
      if (response.data.msg === 'Usuário logado!') {
        setIsLoggedIn(true); 
      }
    });
  };

  const handleClickCadastro = (values: UserSignup) => {
    Axios.post('http://localhost:5050/cadastro', {
      email: values.email,
      password: values.password,
      name: values.name,
    }).then(response => {
      alert(response.data.msg);
    });
  };

  const validationLogin = yup.object().shape({
    email: yup
      .string()
      .email('Digite um e-mail válido.')
      .required('Este campo é obrigatório.'),
    password: yup
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres.')
      .required('Este campo é obrigatório.'),
  });
  const validationCadastro = yup.object().shape({
    name: yup
      .string()
      .min(10, 'Digite seu nome completo.')
      .required('Este campo é obrigatório.'),
    email: yup
      .string()
      .email('Digite um e-mail válido.')
      .required('Este campo é obrigatório.'),
    password: yup
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres.')
      .required('Este campo é obrigatório.'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), undefined], 'As senhas não são iguais'),
  });

  if (isLoggedIn) {
    return <Home />;
  }

  return (
    <div className="container">
      <h1>Login</h1>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={handleClickLogin}
        validationSchema={validationLogin}
      >
        <Form className="login-form">
          <div className="login-form-group">
            <Field name="email" className="form-field" placeholder="Email" />
            <ErrorMessage component="span" name="email" className="form-error" />
          </div>
          <div className="login-form-group">
            <Field name="password" type="password" className="form-field" placeholder="Senha" />
            <ErrorMessage component="span" name="password" className="form-error" />
          </div>

          <button className="button" type="submit">
            Entrar
          </button>
        </Form>
      </Formik>

      <h1>Cadastro</h1>
      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        onSubmit={handleClickCadastro}
        validationSchema={validationCadastro}
      >
        <Form className="login-form">
          <div className="login-form-group">
            <Field name="name" className="form-field" placeholder="Nome" />
            <ErrorMessage component="span" name="name" className="form-error" />
          </div>
          <div className="login-form-group">
            <Field name="email" className="form-field" placeholder="Email" />
            <ErrorMessage component="span" name="email" className="form-error" />
          </div>
          <div className="login-form-group">
            <Field name="password" type="password" className="form-field" placeholder="Senha" />
            <ErrorMessage component="span" name="password" className="form-error" />
          </div>
          <div className="login-form-group">
            <Field
              name="confirmPassword"
              type="password"
              className="form-field"
              placeholder="Confirme sua senha"
            />
            <ErrorMessage component="span" name="confirmPassword" className="form-error" />
          </div>

          <button className="button" type="submit">
            Cadastrar
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default App;
