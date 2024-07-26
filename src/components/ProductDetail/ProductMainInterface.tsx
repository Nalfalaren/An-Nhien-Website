import React, { useContext } from "react";
import { useState, useEffect } from "react";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { CartContext } from "../../context/AddToCartContext.tsx";
import SignInDialog from "../AddToCart/SignInDialog.tsx";
import LoadingState from "../LoadingFrame/Loading.tsx";
import Overlay from "../Login/login/Overlay.tsx";
import CloseIcon from '@mui/icons-material/Close';
const ProductMainInterface = () => {
  const productInfo = useContext(CartContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSignInDialog, setShowSignInDialog] = useState<boolean>(false);
  const access_token = localStorage.getItem("access_token");
  const uid: string | null = localStorage.getItem("user_id");
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const handleAddToCart = () => {
    setIsLoading(true);
    if (access_token) {
      productInfo.handleAddToCart();
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setShowSignInDialog(true);
    }
  };

  
  const { id } = useParams();
  useEffect(() => {
    const fetchProduct = () => {
      if(id){
      const idNumber = parseInt(id)
      productInfo.fetchProductDetails(idNumber);
      }
    }
    
    fetchProduct();
  }, [id]);

  return (
    <div className="px-8">
       {showSignInDialog && <SignInDialog
        open={showSignInDialog}
        handleClose={() => setShowSignInDialog(false)}
      />}
      {isLoading && <LoadingState></LoadingState>}
      <div className={`flex lg:flex-row flex-col items-center gap-[50px]`}>
        <div className="flex flex-col gap-[40px]">
          <div className="flex flex-row mt-[30px] gap-[5px]">
            <span className="font-bold text-[#8D8D8D]">TRANG CHỦ /</span>
            <span className="font-bold text-[#8D8D8D]">
              {productInfo.productInfo.categoryName}
            </span>
          </div>
          <div className="lg:w-[600px] lg:h-[500px] w-[500px] h-[400px] relative">
            {productInfo.productInfo.status === 'ORDERED' && <div className="absolute bg-black opacity-50 absolute lg:w-[600px] lg:h-[500px] w-[500px] h-[400px]"></div>}
            {productInfo.productInfo.status === 'STOCKOUT' && <div className="absolute bg-black opacity-50 absolute lg:w-[600px] lg:h-[500px] w-[500px] h-[400px]"></div>}  
            <img
              src={productInfo.productInfo.thumbnail}
              alt="img_detail"
              className="lg:w-[600px] lg:h-[500px] w-[500px] h-[400px] object-cover"
            ></img>
            {productInfo.productInfo.status === 'ORDERED' && <div className="text-white text-xl font-bold absolute top-0 bg-[#DF6A6A] rounded-br-full px-8 py-8">Đang có người đặt hàng</div>}
            {productInfo.productInfo.status === 'STOCKOUT' && <div className="text-white text-xl font-bold absolute top-0 bg-[#DF6A6A] rounded-br-full px-8 py-8">Hết hàng</div>}  
          </div>
          <div>
            <Button
              variant="contained"
              className="bg-[#472A4B] pr-12 py-4 rounded-[10px] lg:block hidden "
              onClick={() => setIsZoomed(true)}
            >
              <ZoomOutMapIcon className="mr-[30px]"></ZoomOutMapIcon>
              <span className="text-xl font-bold cursor">PHÓNG TO</span>
            </Button>
          </div>
          {isZoomed && <Overlay><div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] z-10"><img src={productInfo.productInfo.thumbnail} alt="zoom-img" className="w-full h-full object-fit"></img></div><div className="absolute top-2 left-2 text-white"><CloseIcon className="w-[60px] h-[60px] hover:text-[#DF6A6A]" onClick={() => setIsZoomed(false)}></CloseIcon></div></Overlay>}
        </div>
        <div className="flex flex-col gap-[20px] lg:my-24 mb-24 w-screen px-8">
          <div>
            <span className="text-3xl font-bold">{productInfo.productInfo.name}</span>
            <div className="h-2 w-[20%] bg-[#D9D9D9] mt-[5px]"></div>
          </div>
          <div>
            <span className="lg:text-lg text-2xl text-[#BF3744] font-bold">
              {new Intl.NumberFormat("vi-en").format(productInfo.productInfo.price)}đ
            </span>
          </div>
          <div className="flex flex-col gap-[10px] text-[#8F8667] font-bold text-xl">
            <span>Chất liệu: {productInfo.productInfo.material}</span>
            <span>Kích thước: {productInfo.productInfo.width} x {productInfo.productInfo.height} (cm)</span>
            <span>Năm sáng tác: {productInfo.productInfo.publishYear}</span>
          </div>
          <div>
            <Button
              variant="contained"
              className="bg-[#DF6A6A] rounded-[10px] p-4 text-xl font-bold lg:max-w-[200px] w-full"
              onClick={handleAddToCart}
            >
              THÊM VÀO GIỎ
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              className="bg-[#FB6E2E] rounded-[10px] px-9 py-4 text-xl font-bold lg:max-w-[200px] w-full"
              onClick={handleAddToCart}
            >
             <Link to="/add-to-cart">MUA NGAY</Link>
            </Button>
          </div>
          <div className="flex flex-col gap-[10px] text-[#8F8667] text-xl font-bold">
            <span>Mã: {productInfo.productInfo.id}</span>
            <hr></hr>
            <span>Danh mục: {productInfo.productInfo.categoryName}</span>
            <hr></hr>
            <div className="flex flex-row gap-[10px] items-center">
            <span>Trạng thái: {productInfo.productInfo.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default ProductMainInterface;
