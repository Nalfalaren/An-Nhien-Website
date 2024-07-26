import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ClickAdmin } from "../../../context/AdminController.tsx";
import KeyboardReturn from "@mui/icons-material/KeyboardReturn";
import useAccessToken from "../../../composables/getAccessToken.ts";
import LoadingState from "../../LoadingFrame/Loading.tsx";
import { Customer, Order } from "../../../interface/IUSerInfo.ts";
import AdminHorizontal from "../AdminHorizontal.tsx";
import SuccessMessage from "../../LoadingFrame/SuccessMessage.ts";
import failMessage from "../../LoadingFrame/FailMessage.ts";
import getUserOrderInfo from "../../../composables/getUserOrderInfo.ts";
import getOrderProduct from "../../../composables/getOrderProduct.ts";
import { fetchImage } from "../../../composables/getImage.ts";
interface inputData{
  employeeId: string,
  orderId: string | undefined,
}
interface AddToCartElement {
  orderdetail_id: number;
  order_id: number;
  product_id: number;
  product_price: number;
  product_name: string;
  product_thumbnail: string | null;
}

const AdminBillsDetail = () => {
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);
  const [employeeList, setEmployeeList] = useState<Customer[]>([]);
  const [orderedProduct, setOrderedProduct] = useState<AddToCartElement[]>([]);
  const [thumbnailFetched, setThumbnailFetched] = useState<boolean[]>([]);
  const [eid, setEid] = useState<string>("");
  const role = localStorage.getItem("role");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const handleNav = useContext(ClickAdmin);
  const { accessToken, loading } = useAccessToken();

  const handleValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEid(e.target.value);
  };

  const handleNavigation = () => {
    handleNav.handleSetMode("bills");
    navigate(-1);
  };

  const handleImg = (id: number) => {
    navigate(`/admin/products/${id}`);
  }

  const handleMoreImg = (id: string) => {
    navigate(`/admin/order/${id}/img`)
  }
  
  useEffect(() => {
    const fetchEmployee = async (accessToken: string) => {
      if (loading) return; 
      try {
        const response = await fetch(
          `http://localhost:8686/admin/users/role=EMPLOYEE`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setEmployeeList(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

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
      fetchEmployee(accessToken);
      fetchOrder(accessToken);
      fetchOrderProduct(accessToken);
    }
  }, [accessToken, loading]);

  const fetchCustomerDetails = async (e) => {
    e.preventDefault();
    try {
      const inputData = { employeeId: eid, orderId: id };
      const response = await fetch(`http://localhost:8686/orders/admin/update-employee`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(inputData),
      });
      const data = await response.json();  
      if (response.ok) {
        SuccessMessage("Giao việc thành công!");
        handleNavigation();
      } else {
        failMessage(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

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
                  onClick={() => {
                    handleNav.handleSetMode("bills");
                    navigate("/admin");
                  }}
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
          <form onSubmit={fetchCustomerDetails}>
            <div className="flex flex-col gap-[50px]">
              <div className="flex flex-row justify-between items-center">
                <DetailRow
                  label="Tên khách hàng"
                  value={orderDetail.name}
                ></DetailRow>
                <DetailRow label="ID đơn hàng" value={id}></DetailRow>
              </div>
              <div className="flex flex-row justify-between items-center">
                <DetailRow
                  label="Số điện thoại"
                  value={orderDetail.phoneNumber}
                ></DetailRow>
                <DetailRow label="Ghi chú" value={orderDetail.note}></DetailRow>
              </div>
              <div className="flex flex-row justify-between w-full">
                <DetailRow
                  label="Địa chỉ"
                  value={orderDetail.address}
                ></DetailRow>
                <DetailRow
                  label="Giao công việc này cho"
                  value={
                    orderDetail.status === 'PENDING' || orderDetail.status === 'INIT' ? (
                    <select onChange={handleValue} className="w-[550px]">
                      <option selected disabled value="">
                        Chọn nhân viên cho đơn hàng này!
                      </option>
                      {employeeList.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.full_name}
                        </option>
                      ))}
                    </select>) : (
                      <div>{orderDetail.employee.fullName}</div>
                    )
                  }
                ></DetailRow>
              </div>
              <div className="flex flex-row justify-between w-full">
                <DetailRow2
                  label="Tên hàng"
                  value={orderedProduct.slice(0,4)
                    .map((product) => product.product_name)
                    .join(" ,")}
                    order={orderedProduct.length}
                ></DetailRow2>
                <div className="flex flex-col gap-[10px]">
                  <h1 className="font-bold text-2xl">Sản phẩm*</h1>
                  <div className="flex flex-row gap-[20px]">
                    {orderedProduct.slice(0, 4).map((product) => (
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
                    {orderedProduct.length > 4 && <span onClick={() => handleMoreImg(id)}>And {orderedProduct.length - 4} more,<br/><span className="font-bold">nhấn để xem tiếp</span></span>}
                  </div>
                </div>
              </div>
            </div>
            {role === 'ADMIN' && <div className="flex justify-between py-12">
              <Button
                type="submit"
                className="bg-emerald-600 text-white text-xl font-bold font-bold px-12 py-4 cursor-pointer hover:bg-emerald-900 hover:font-bold"
                disabled={orderDetail.status !== 'PENDING'}
              >
                Lưu
              </Button>
            </div>}
          </form>
        </div>
      </div>
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value: React.ReactNode[] | string;
}

interface DetailRowProps2 {
  label: string;
  value: React.ReactNode[] | string;
  order: number;
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

const DetailRow2: React.FC<DetailRowProps2> = ({ label, value, order }) => {
  return (
    <div className="flex flex-col gap-[10px]">
      <h1 className="font-bold text-2xl">{label} *</h1>
      {value ? (
        <div className="bg-white p-2 border-2 border-solid border-black w-[600px] h-[80px] text-xl flex flex-row ">
          {value}
          {order > 5 && <p>And {order - 5} more</p>}
        </div>
      ) : (
        <div className="bg-white p-2 border-2 border-solid border-black w-full">
          <span className="text-2xl">No information</span>
        </div>
      )}
    </div>
  );
};
export default AdminBillsDetail;
