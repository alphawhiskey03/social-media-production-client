import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);
  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    const isValidated = Object.values(values).every((value) => value !== "");
    if (isValidated) {
      callback();
    }
  };
  const clearValues = () => {
    setValues(initialState);
  };

  return {
    onChange,
    onSubmit,
    values,
    clearValues,
  };
};
