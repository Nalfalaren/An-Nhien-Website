import React from 'react';
import { useState, useEffect } from 'react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import failMessage from '../components/LoadingFrame/FailMessage.ts';
interface ResponseBody{
  id: number,
  thumbnail: string,
  name: string,
  width: number,
  height: number,
}
const SwiperComponent = () => {
const [productImage, setProductImage] = useState<ResponseBody[]>([{id: 0, thumbnail: "", name: "", width: 0, height: 0}]);
const navigate = useNavigate();
const handleNav = (id: number) => {
  navigate(`category/${id}`);
};
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await fetch("http://localhost:8686/products");
        if (response.ok) {
          const data: ResponseBody[] = await response.json();
          const landscapeImages : ResponseBody[] = data.filter((image) => image.width > image.height)
          console.log(landscapeImages);    
          setProductImage(landscapeImages);
          landscapeImages.forEach(product => fetchImage(product.thumbnail));
        } else {
          failMessage("Đã có vấn đề xảy ra!")
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    const fetchImage = async (thumbnail: string) => {
      try {
        const response = await fetch(`http://localhost:8686/products/images/${thumbnail}`);
        const imageBlob: Blob = await response.blob();
        const outputImage = URL.createObjectURL(imageBlob);
        if (response.ok) {
          setProductImage(products => {
            return products.map(product => {
              if (product.thumbnail === thumbnail) {
                return { ...product, thumbnail: outputImage };
              }
              return product;
            });
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchProductList();
  }, []);  

  return (
    <div className="w-6/10 h-full mx-auto my-12 max-w-[1500px]">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        autoplay={{ delay: 1000 }}
        loop={true}
      >
        {productImage.map((productImg) => (
        <SwiperSlide>
         <div className='relative' onClick={() => handleNav(productImg.id)}>
          <div className='w-full lg:h-[500px] md:h-[400px] sm:h-[300px] h-[200px]'>
          <img
            key={productImg.id}
            src={productImg.thumbnail}
            alt="cover_img"
            className="w-full h-full object-cover"
          />
          </div>
          <div className='lg:text-xl text-base text-white absolute xl:left-[70%] xl:top-[70%] lg:left-[65%] lg:top-[70%] md:top-[65%] md:left-[55%] sm:top-[50%] sm:left-[50%] top-[40%] left-[45%] font-semibold bg-[#DF6A6A] shadow-shadow_primary p-4 rounded-[20px] flex flex-col gap-[20px]  '>
          <h1>Tên tranh: {productImg.name}</h1>
          <Button className="bg-[#DF6A6A] rounded-[10px] bg-black text-white w-full">Xem ngay</Button>
          </div>
          </div>
       </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
