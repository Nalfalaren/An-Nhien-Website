import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ClickAdmin } from "../../../context/AdminController.tsx";
import KeyboardReturn from "@mui/icons-material/KeyboardReturn";
import useAccessToken from "../../../composables/getAccessToken.ts";
import LoadingState from "../../LoadingFrame/Loading.tsx";
import { Order } from "../../../interface/IUSerInfo.ts";
import AdminHorizontal from "../AdminHorizontal.tsx";
import getUserOrderInfo from "../../../composables/getUserOrderInfo.ts";
import getOrderProduct from "../../../composables/getOrderProduct.ts";
import { fetchImage } from "../../../composables/getImage.ts";

interface AddToCartElement {
  orderdetail_id: number;
  order_id: number;
  product_id: number;
  product_price: number;
  product_name: string;
  product_thumbnail: string | null;
}

const AdminImgDetail = () => {
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);
  const [orderedProduct, setOrderedProduct] = useState<AddToCartElement[]>([]);
  const [thumbnailFetched, setThumbnailFetched] = useState<boolean[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken, loading } = useAccessToken();

  const handleNavigation = () => {
    navigate(`/admin/orders/${id}`)
  };

  const handleImg = (id: number) => {
    navigate(`/admin/products/${id}`);
  }


  useEffect(() => {
    if (loading) return; 

    const fetchOrder = async (accessToken: string | null) => {
      const data = await getUserOrderInfo(accessToken, id);
      setOrderDetail(data);
    };

    const fetchOrderProduct = async (accessToken: string | null) => {
      const data = await getOrderProduct(accessToken, id);
      setThumbnailFetched(Array(orderedProduct.length).fill(false));
      setOrderedProduct(data);
    };

    if (accessToken) {
      fetchOrder(accessToken);
      fetchOrderProduct(accessToken);
    }
  }, [accessToken, loading]);

  const fetchThumbnails = async (index: number) => {
    if (orderDetail) {
      const outputImage = await fetchImage(
        orderedProduct[index].product_thumbnail
      );
      setOrderedProduct((prevProducts) => {
        const updatedProducts = [...prevProducts];
        updatedProducts[index] = {
          ...updatedProducts[index],
          product_thumbnail: outputImage,
        };
        return updatedProducts;
      });
    }
    setThumbnailFetched((prevThumbnailFetched) => {
      const updatedThumbnailFetched = [...prevThumbnailFetched];
      updatedThumbnailFetched[index] = true;
      return updatedThumbnailFetched;
    });
  };

  useEffect(() => {
    if (orderedProduct) {
      orderedProduct.forEach((_, index) => {
        if (!thumbnailFetched[index]) {
          fetchThumbnails(index);
        }
      });
    }
  }, [orderDetail, thumbnailFetched]);

  if (!orderDetail) {
    return <LoadingState></LoadingState>;
  }

  return (
    <div>
      {" "}
      <AdminHorizontal />
      <div className="absolute top-[55%] left-1/2  transform -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] bg-[#D9D9D9]">
        <div>
          <div className="flex flex-row justify-between items-center px-8 py-4">
            <div>
              <h1 className="font-bold text-2xl">Thông tin chi tiết</h1>
            </div>
            <div className="flex flex-row justify-between items-center gap-[20px]">
              <div>
                <Button
                  variant="contained"
                  className="bg-[#899BE0]"
                  onClick={handleNavigation}
                >
                  <div className="flex items-center gap-[10px]">
                    <KeyboardReturn></KeyboardReturn>
                    <span>Trở về</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-[10px] gap-4 px-8 py-4 bg-[#EEF0F1] h-[75%] w-[85%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col gap-[50px]">
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col gap-[10px]">
                  <h1 className="font-bold text-2xl">Ảnh minh họa *</h1>
                  <div className="grid grid-cols-12 gap-[20px]">
                    {orderedProduct.map((product) => (
                      <div>
                        <div
                          key={product.order_id}
                          className="w-[100px] h-[100px]"
                          onClick={() => handleImg(product.product_id)}
                        >
                          <img
                            src={product.product_thumbnail}
                            alt="product"
                            className="w-full h-full object-fit"
                          ></img>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value: React.ReactNode[] | string;
}


const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => {
  return (
    <div className="flex flex-col gap-[10px]">
      <h1 className="font-bold text-2xl">{label} *</h1>
      {value ? (
        <div className="bg-white p-2 border-2 border-solid border-black w-[600px] h-[50px] text-2xl truncate">
          {value}
        </div>
      ) : (
        <div className="bg-white p-2 border-2 border-solid border-black w-[600px] h-[50px] text-2xl truncate">
          <span className="text-2xl">No information</span>
        </div>
      )}
    </div>
  );
};

export default AdminImgDetail;
