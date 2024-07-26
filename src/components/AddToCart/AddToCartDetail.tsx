import React, { useContext } from "react";
import { CartContext } from "../../context/AddToCartContext.tsx";
import { useEffect } from "react";
import { Button, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
const AddToCartDetail = () => {
  const productList = useContext(CartContext);
  const navigate = useNavigate();
  const access_token = localStorage.getItem("access_token");
  const uid: string | null = localStorage.getItem("user_id");

  useEffect(() => {
    productList.showAddToCart(access_token, uid);
  }, []);

  useEffect(() => {
    productList.handleTotalPrice();
  }, [productList.addToCartProductList.length]);

  const handleNav = () => {
    navigate("/");
  };

  const handlePayment = () => {
    navigate("/add-to-cart/payment");
  };

  return (
    <div>
      <div className="p-16">
        <span className="font-bold text-[#8D8D8D]">TRANG CHỦ /</span>
        <span className="font-bold text-[#8D8D8D] ml-[10px]">GIỎ HÀNG</span>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-[#8D8D8D] text-center">
          Giỏ Hàng
        </h1>
      </div>
      {productList.addToCartProductList.length > 0 ? (
        <div className="flex xl:flex-row justify-between 2xl:max-w-[1800px] xl:max-w-[1400px] flex-col mx-auto mt-[50px] gap-[50px]">
          <div className="flex flex-col basis-[60%] gap-[10px]">
            <div className="flex flex-row justify-between items-center text-xl font-bold">
              <div>
                <h1>SẢN PHẨM</h1>
              </div>
              <div>
                <h1>GIÁ</h1>
              </div>
              <div className="flex basis-[20%]">
                <h1>TỔNG CỘNG</h1>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              {productList.addToCartProductList.map((product) => (
                <div className="flex flex-col" key={product.product_id}>
                  <hr className="h-[2px] w-full bg-[#E9E9E9] my-[15px]"></hr>
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-[10px] basis-[50%]">
                      <img
                        src={product.product_thumbnail}
                        alt={product.product_id}
                        className="max-w-32 max-h-32 object-contain sm:block hidden"
                      ></img>
                      <span className="xl:text-xl sm:text-lg text-sm font-bold">
                        {product.product_name}
                      </span>
                    </div>
                    <div className="flex basis-[47%] grow-0">
                      <span className="xl:text-xl sm:text-lg text-sm text-red-500 font-bold">
                        {" "}
                        {new Intl.NumberFormat("vi-en").format(
                          product.product_price
                        )}
                        đ
                      </span>
                    </div>
                    <div className="flex basis-[20%]">
                      <span className="xl:text-xl sm:text-lg text-sm text-red-500 font-bold">
                        {" "}
                        {new Intl.NumberFormat("vi-en").format(
                          product.product_price
                        )}
                        đ
                      </span>
                    </div>
                    <div className="">
                      <DeleteIcon
                        className="hover:text-[#DF6A6A]"
                        onClick={() =>
                          productList.deleteAddToCartProduct(
                            product.orderdetail_id
                          )
                        }
                      ></DeleteIcon>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-[2px] h-[400px] bg-[#E9E9E9]  xl:block hidden"></div>
          <div className="flex flex-col gap-[20px] flex-1">
            <div>
              <h1 className="text-3xl font-bold">Tổng số lượng</h1>
            </div>
            <hr className="h-[2px] w-full bg-[#E9E9E9]"></hr>
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-xl font-bold">Tổng tiền</h1>
              <p className="text-xl text-red-500 font-bold">
                {new Intl.NumberFormat("vi-en").format(productList.totalPrice)}đ
              </p>
            </div>
            <hr className="h-[2px] w-full bg-[#E9E9E9]"></hr>
            <Button
              className="bg-[#DF6A6A] py-4 md:mb-0 mb-[30px]"
              onClick={handlePayment}
            >
              <p className="text-xl font-bold text-white">
                Tiến hành thanh toán!
              </p>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-[20px]">
          <p className="text-center py-8 lg:text-2xl font-bold text-lg">
            Bạn chưa mua sản phẩm nào cả, xin hãy mua sản phẩm để tiếp tục!
          </p>
          <Button
            onClick={handleNav}
            className="bg-[#DF6A6A] text-white text-xl font-bold w-[300px] mx-auto p-4 cursor-pointer md:mb-0 mb-[30px]"
          >
            Quay về trang chủ
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddToCartDetail;
