import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ButtonCom from "../shared/ButtonCom";
import InputPassword from "../shared/InputPassword";
import Loader from "../shared/Loader";
import { postRequest } from "../utils/api";
import { resetPasswordErrorObj, resetPasswordObj } from "../utils/staticObj";
import validate from "../utils/validate";

const ResetPassword = () => {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [passwordObj, setPasswordObj] = useState(resetPasswordObj);
  const [error, setError] = useState(resetPasswordErrorObj);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordObj({ ...passwordObj, [name]: value });
    let errors = {};
    if (name === "confirmPassword") {
      errors[name] = validate(name, value, passwordObj?.password);
    } else {
      errors[name] = validate(name, value);
    }
    setError({ ...error, ...errors });
  };

  const validation = () => {
    const errors = {};
    Object.entries(passwordObj).forEach(([key, value]) => {
      if (key === "confirmPassword") {
        errors[key] = validate(key, value, passwordObj?.password);
      } else {
        errors[key] = validate(key, value);
      }
    });
    setError(errors);
    return Object.values(errors).every((val) => !val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validation()) {
      try {
        setLoading(true);
        let response = await postRequest(
          "users/ResetPassword",
          {
            oldPassword: passwordObj.oldPassword,
            Password: passwordObj.password,
            ConfirmPassword: passwordObj.confirmPassword,
          },
          {
            "access-token": token,
          },
        );
        if (response.statusCode === 200) {
          toast.success("password reset successfully.");
          setPasswordObj(resetPasswordObj);
        } else {
          toast.error(response?.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: "10px",
      }}
    >
      {loading && <Loader />}
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "20px",
          border: "1px solid gray",
          borderRadius: "10px",
          margin: "20px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: "600px", width: "100%" }}
        >
          <h1 style={{ textAlign: "center", color: "rgb(18, 219, 206)" }}>
            Reset password
          </h1>
          <br />
          <label htmlFor="oldPassword">Old Password:</label>
          {error?.oldPassword && (
            <span style={{ color: "red" }}>{error.oldPassword}</span>
          )}
          <InputPassword
            placeholder="Old password..."
            id="oldPassword"
            name="oldPassword"
            value={passwordObj.oldPassword}
            onChange={handleChange}
          />
          <label htmlFor="newPassword">New Password:</label>
          {error?.password && (
            <span style={{ color: "red" }}>{error.password}</span>
          )}
          <InputPassword
            placeholder="New password..."
            id="newPassword"
            name="password"
            value={passwordObj.password}
            onChange={handleChange}
          />
          <label htmlFor="confirmPassword">Confirm Password:</label>
          {error?.confirmPassword && (
            <span style={{ color: "red" }}>{error.confirmPassword}</span>
          )}
          <InputPassword
            placeholder="Confirm password..."
            id="confirmPassword"
            name="confirmPassword"
            value={passwordObj.confirmPassword}
            onChange={handleChange}
          />
          <ButtonCom type="submit">Submit</ButtonCom>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
