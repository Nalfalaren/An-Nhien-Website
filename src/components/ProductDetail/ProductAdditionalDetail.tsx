import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
interface ResponseBody {
  description: string;
  height: number;
  width: number;
  id: number;
  material: string;
}
const ProductAdditionalDetail = () => {
  const [productInfo, setProductInfo] = useState<ResponseBody>({
    description: "",
    height: 0,
    width: 0,
    id: 0,
    material: "",
  });

  const { id } = useParams();
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8686/products/${id}`);
        const data = await response.json();
        if (response.ok) {
          setProductInfo({
            description: data.description,
            height: data.height,
            width: data.width,
            id: data.id,
            material: data.material,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductDetails();
  }, [id]);
  return (
    <div className="px-8">
      <hr className="mb-[20px]"></hr>
      <div className="flex flex-col gap-[30px] my-[40px]">
        <h1 className="text-2xl font-bold my-8">THÔNG TIN KĨ THUẬT</h1>
        <div className="flex flex-row items-center text-xl text-[#858888]">
          <span className="mr-[200px]">CHẤT LIỆU</span>
          <span>{productInfo.material}</span>
        </div>
      <hr></hr>
      <div className="flex flex-row items-center text-xl text-[#858888]">
          <span className="mr-[180px]">KÍCH THƯỚC</span>
          <span>{productInfo.width} x {productInfo.height} (cm)</span>
        </div>
      <hr></hr>
      <div className="flex flex-row items-center  text-xl text-[#858888]">
          <span className="mr-[160px]">TRANH HỌA SĨ</span>
          <span>Tranh sáng tác, độc bản và có giấy tác quyền của họa sĩ</span>
        </div>
        <hr></hr>
      <div className="flex flex-row items-center  text-xl text-[#858888]">
          <span className="mr-[145px]">MIÊU TẢ TRANH</span>
          <span>{productInfo.description}</span>
        </div>
      </div>
      <hr className="mt-36"></hr>
    </div>
  );
};

export default ProductAdditionalDetail;
