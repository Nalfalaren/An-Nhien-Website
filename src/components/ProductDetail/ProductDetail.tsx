import React, { useState, useEffect } from "react";
import ProductMainInterface from "./ProductMainInterface.tsx";
import ProductAdditionalDetail from "./ProductAdditionalDetail.tsx";
import Footer from "../Homepage/Footer/Footer.tsx";
import SpecialPicture from "../Homepage/Items/SpecialPicture.tsx";
import NavCover from "../Homepage/Navbar/NavCover.tsx";
import NavMain from "../Homepage/Navbar/NavMain.tsx";
import ToolBar from "../Homepage/Navbar/Toolbar.tsx";
import { useParams } from "react-router-dom";
import ErrorPage from "../ErrorPage/ErrorPage.tsx";
const ProductDetail = () => {
  const { id } = useParams();
  const [productExists, setProductExists] = useState(false);

  useEffect(() => {
    const checkProductExistence = async () => {
      const exists = await fetch(`http://localhost:8686/products/${id}`);
      setProductExists(exists.ok);
    };

    if (id) {
      checkProductExistence();
    }
  }, [id]);

  return (
    <div>
      {productExists? (
        <>
          <NavCover />
          <ToolBar />
          <NavMain />
          <div className="max-w-[1100px] mx-auto my-8">
            <ProductMainInterface />
            <ProductAdditionalDetail />
            <div className="mb-20">
              <SpecialPicture />
            </div>
          </div>
          <Footer />
        </>
      ) : (
        <ErrorPage />
      )}
    </div>
  );
};

export default ProductDetail;
