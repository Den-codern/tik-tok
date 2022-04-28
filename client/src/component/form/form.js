import { useState } from "react";

import SignUp from "./signup";
import Login from "./login";
function Form({ formOpen, setFormOpen }) {
  const [type, setType] = useState("signup");

  return (
    <>
      {type === "signup" ? (
        <SignUp
          setType={setType}
          type={type}
          formOpen={formOpen}
          setFormOpen={setFormOpen}
        />
      ) : (
        <Login
          type={type}
          setType={setType}
          formOpen={formOpen}
          setFormOpen={setFormOpen}
        />
      )}
    </>
  );
}

export default Form;
