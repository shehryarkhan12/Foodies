
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import RestaurantSearch from "./RestaurantSearch";

const App = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    // Do your registration logic here with formData
    // After registration is complete, you can navigate to another route
    history.push("/");
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/restaurant-search" component={RestaurantSearch} />
      </Switch>
      <div>
        <h1>Register Form</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </Router>
  );
};

export default App;
