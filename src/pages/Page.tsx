import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/Login/login/Login.tsx";
import Signup from "../components/Login/login/Signup.tsx";
import ForgetPassword from "../components/Login/login/ForgetPassword.tsx";
import Homepage from "../components/Homepage/Homepage.tsx";
import ProductDetail from "../components/ProductDetail/ProductDetail.tsx";
import ErrorPage from "../components/ErrorPage/ErrorPage.tsx";
import Admin from "../components/Admin/Admin.tsx";
import AdminPageDetail from "../components/Admin/AdminPageDetail.tsx";
import AdminAddUser from "../components/Admin/AdminAddUser.tsx";
import AdminAddEmployee from "../components/Admin/AdminAddEmployee.tsx";
import AdminModify from "../components/Admin/AdminModify.tsx";
import AdminCategoryDetail from "../components/Admin/Categories/AdminCategoryDetail.tsx";
import AdminCategoryAdd from "../components/Admin/Categories/AdminCategoriesAdd.tsx";
import AdminCategoriesModify from "../components/Admin/Categories/AdminCategoriesModify.tsx";
import AdminModifyEmployee from "../components/Admin/AdminModifyEmployee.tsx";
import AdminProductAdd from "../components/Admin/Product/AdminProductAdd.tsx";
import AdminProductModify from "../components/Admin/Product/AdminProductModify.tsx";
import AdminProductDetail from "../components/Admin/Product/AdminProductDetail.tsx";
import AdminEmployeeDetail from "../components/Admin/AdminEmployeeDetail.tsx";
import CategoryTotal from "../components/ProductList/Category/CategoryTotal.tsx";
import AddToCart from "../components/AddToCart/AddToCart.tsx";
import Payment from "../components/Payment/Payment.tsx";
import AdminBillsDetail from "../components/Admin/Bill/AdminBillsDetail.tsx";
import AdminImgDetail from "../components/Admin/Bill/AdminImgDetail.tsx";
import AdminBillsModify from "../components/Admin/Bill/AdminBillsModify.tsx";

const Page = () => {
  const [role, setRole] = useState<string | null >("");
  const [accessToken, setAccessToken] = useState<string | null>("");
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const access_token = localStorage.getItem("access_token");
    setAccessToken(access_token)
    setRole(userRole);
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/sign_up" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/category/:id" element={<ProductDetail />} />
        <Route path="/:id" element={<CategoryTotal />} />
        <Route path="/add-to-cart" element={<AddToCart></AddToCart>} />
        {accessToken && <Route path="/add-to-cart/payment" element={<Payment></Payment>}></Route>}

        {role && ["ADMIN", "MANAGER", "EMPLOYEE"].includes(role) && (
          <>
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/admin/users/add_employees"
              element={<AdminAddEmployee />}
            />
            <Route
              path="/admin/users/customer/:id"
              element={<AdminPageDetail />}
            />
            <Route
              path="/admin/users/employee/:id"
              element={<AdminEmployeeDetail />}
            />
            <Route
              path="/admin/users/add_customers"
              element={<AdminAddUser />}
            />
            <Route
              path="/admin/users/:id/modify_customer"
              element={<AdminModify />}
            />
            <Route
              path="/admin/users/:id/modify_employee"
              element={<AdminModifyEmployee />}
            />
            <Route
              path="/admin/categories/:id"
              element={<AdminCategoryDetail />}
            />
            <Route
              path="/admin/categories/add_category"
              element={<AdminCategoryAdd />}
            />
            <Route
              path="/admin/categories/:id/modify_category"
              element={<AdminCategoriesModify />}
            />
            <Route
              path="/admin/products/:id"
              element={<AdminProductDetail />}
            />
            <Route
              path="/admin/products/add_product"
              element={<AdminProductAdd />}
            />
            <Route
              path="/admin/products/:id/modify_product"
              element={<AdminProductModify />}
            />
            <Route path="admin/order/:id/img" element={<AdminImgDetail></AdminImgDetail>}></Route>
            <Route path="/admin/orders/:id" element={<AdminBillsDetail></AdminBillsDetail>}></Route>
            <Route path="/admin/orders/:id/modify" element={<AdminBillsModify></AdminBillsModify>}></Route>
          </>
        )}
      <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default Page;
