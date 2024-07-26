import { Paper, Container, TextField, Button } from "@mui/material";
import React, { useContext, useState } from "react";
import { IUserInfo, ResponseBody } from "../../../interface/IUserInfo.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ClickTheme.tsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import schema from "../../../validation/SignInVal.ts";
import { useNavigate } from "react-router-dom";
import LoadingState from "../../LoadingFrame/Loading.tsx";
import SuccessMessage from "../../LoadingFrame/SuccessMessage.ts";
import failMessage from "../../LoadingFrame/FailMessage.ts";

const Login = () => {
  const click = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserInfo>({ resolver: zodResolver(schema) });

  const submitForm = async (data: IUserInfo) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8686/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (response.ok) {
        const responseBody: ResponseBody = await response.json();

        localStorage.setItem("full_name", responseBody.full_name);
        localStorage.setItem("access_token", responseBody.tokens.access_token);
        localStorage.setItem("refresh_token", responseBody.tokens.refresh_token);
        localStorage.setItem("role", responseBody.role);
        localStorage.setItem("user_id", responseBody.user_id);
        SuccessMessage("Đăng nhập thành công");
        if (localStorage.getItem("access_token") !== null && localStorage.getItem("role") !== "CUSTOMER") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        failMessage("Mật khẩu hoặc tài khoản chưa đúng!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Container>
        {isLoading && <LoadingState></LoadingState>}
        <Paper
          elevation={3}
          className="md:px-[30px] md:py-[20px] md:w-[600px] w-8/10 py-[10px] px-[15px] absolute top-1/2 left-1/2 transform -translate-x-[50%] -translate-y-[50%]"
        >
          <div className="flex flex-row items-center justify-end">
            <ArrowBackIcon className="font-bold"></ArrowBackIcon>
            <Link to="/" className="font-bold">
              Quay lại trang chủ
            </Link>
          </div>
          <h1 className="sm:text-3xl font-bold pb-8 text-2xl ">Đăng nhập</h1>
          <form
            className="flex flex-col justify-center align-center gap-[20px] text-lg"
            onSubmit={handleSubmit(submitForm)}
          >
            <label htmlFor="account" className="text-lg">
              Số điện thoại hoặc địa chỉ email*
            </label>
            <TextField
              className="bg-login_input"
              id="outlined-basic"
              variant="outlined"
              type="text"
              {...register("username")}
            />
            {errors.username && (
              <span className="text-red-500 font-bold">
                {errors.username.message}
              </span>
            )}
            <label htmlFor="password" className="">
              Mật khẩu *
            </label>
            <div className="relative">
              <TextField
                className="bg-login_input w-full"
                id="filled-basic"
                variant="outlined"
                type={click.isClicked ? "text" : "password"}
                {...register("password")}
              />
              {click.isClicked ? (
                <VisibilityIcon
                  onClick={click.handleClick}
                  className="absolute right-3 bottom-4"
                ></VisibilityIcon>
              ) : (
                <VisibilityOffIcon
                  className="absolute right-3 bottom-4"
                  onClick={click.handleClick}
                ></VisibilityOffIcon>
              )}
            </div>
            {errors.password && (
              <span className="text-red-500 font-bold">
                {errors.password.message}
              </span>
            )}
            <Button
              variant="contained"
              type="submit"
              className="md:w-3/10"
              style={{ backgroundColor: "#9A917A", paddingBlock: ".8rem" }}
              onClick={() => click.resetError()}
            >
              Đăng nhập
            </Button>
          </form>
          <div className="mt-[20px]">
            <Link to="/forgot-password" className="font-bold text-f_pw">
              Quên mật khẩu
            </Link>
          </div>
          <hr className="my-[30px] w-full"></hr>
          <div className="text-f_pw text-center">
            <span>
              Chưa có tài khoản?
              <Link to="/sign_up" className="font-bold ml-[5px]">
                Đăng ký
              </Link>
            </span>
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
