import React, { useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import { ClickBarContext } from "../../../context/ClickForHomepage.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductList } from "../../../composables/getProductList.ts";
import { ProductGet } from "../../../interface/IProduct.ts";
import { fetchImage } from "../../../composables/getImage.ts";
import useAccessToken from "../../../composables/getAccessToken.ts";
import SignInDialog from "../../AddToCart/SignInDialog.tsx";
import LoadingState from "../../LoadingFrame/Loading.tsx";
import { CartContext } from "../../../context/AddToCartContext.tsx";
export interface ResponseProductBody {
  id: number;
  name: string;
  price: number;
  thumbnail: string | null;
  thumbnailImage: string | undefined;
  status: string;
}

const ToolBar = () => {
  const clickBar = useContext(ClickBarContext);
  const addToCartList = useContext(CartContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { accessToken, loading } = useAccessToken();
  const handleNavigate = () => {
    navigate("/");
  };
  const handleNavigateForProduct = (id: number) => {
    navigate(`/category/${id}`)
  }

  const handleNavigateForAddToCart = () => {
    navigate(`/add-to-cart`)
  }
  const [products, setProducts] = useState<ResponseProductBody[]>([
    {
      id: 0,
      name: "",
      price: 0,
      thumbnail: "",
      thumbnailImage: "",
      status: "",
    },
  ]);

  const [searchResult, setSearchResult] = useState<string>('');
  const [thumbnailFetched, setThumbnailFetched] = useState<boolean[]>([]);
  const [showSignInDialog, setShowSignInDialog] = useState<boolean>(false);

  const handleAddToCart = () => {
    if (accessToken) {
      handleNavigateForAddToCart();
    } else {
      setShowSignInDialog(true);
    }
  };

useEffect(() => {
 const handleProduct = async () => {
  setIsLoading(true);
    try {
      const productData: ProductGet[] = await getProductList(null);
      setProducts(productData);
      setThumbnailFetched(Array(productData.length).fill(false));
      addToCartList.handleTotalPrice();
    } catch (error) {
      console.error(error);
    }
    finally{
      setIsLoading(false);
    }
  };
  handleProduct();
}, [])

  const fetchThumbnails = async (index: number) => {
    const outputImage = await fetchImage(products[index].thumbnail);
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        thumbnailImage: outputImage,
      };
      return updatedProducts;
    });
    setThumbnailFetched((prevThumbnailFetched) => {
      const updatedThumbnailFetched = [...prevThumbnailFetched];
      updatedThumbnailFetched[index] = true;
      return updatedThumbnailFetched;
    });
  };

  useEffect(() => {
    products.forEach((_, index) => {
      if (!thumbnailFetched[index]) {
        fetchThumbnails(index);
      }
    });
  }, [products, thumbnailFetched]);

  const handleSearch = (e : React.ChangeEvent<HTMLInputElement>) => {
    setSearchResult(e.target.value);
  }
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchResult.toLowerCase()));
  
  return (
    <div className="bg-white md:flex md:flex-row md:justify-evenly md:items-center md:my-[30px] max-w-[1700px] mx-auto md:shadow-none md:border-none md:w-full lg:px-8 shadow-shadow_primary border-2 border-solid w-8/10 p-4 z-10">
       {showSignInDialog && <SignInDialog
        open={showSignInDialog}
        handleClose={() => setShowSignInDialog(false)}
      />}
      <div className="md:block flex flex-row justify-between items-center ">
        <div className="md:hidden block">
          <MenuIcon onClick={clickBar.handleBarClick}></MenuIcon>
        </div>
        <span
          className="font-beau text-red-500 xl:text-5xl text-4xl font-bold"
          onClick={handleNavigate}
        >
          <span className="text-[#89A8A4] xl:text-5xl text-4xl font-aladin">
            AN
          </span>
          NHIÊN
        </span>
        <div className="md:hidden block relative" onClick={handleAddToCart}>
          <ShoppingCartIcon></ShoppingCartIcon>
          <div className="absolute -top-1 -right-1 bg-[#DF6A6A] w-[17px] h-[17px] rounded-full"><span className="absolute top-1/2 left-1/2 -transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-sm">{addToCartList.addToCartProductList.length}</span></div>
        </div>
      </div>
      <div className="flex flex-col items-center basis-[60%] relative">
  <div className="md:flex md:flex-row md:relative md:w-1/2 relative p-4">
    <input
      type="text"
      placeholder="Tìm kiếm sản phẩm"
      className="bg-[#F7F7F7] p-3 rounded-[20px] w-full h-full border-2 border-solid"
      onChange={handleSearch}
    />
    <div className="absolute right-6 top-6">
      <SearchIcon className="text-[#7D7D7D]" />
    </div>
  </div>
  {searchResult.length > 0 && <div className="flex flex-col items=center gap-[20px] absolute top-full bg-white border border-2 border-solid border-[#D9D9D9] z-10 w-1/2 shadow-shadow_primary overflow-y-auto max-h-[350px]">
  {isLoading && <LoadingState></LoadingState>}
    {filteredProducts.length > 0 ? filteredProducts.map((product) => (
      <div key={product.id} className="flex flex-row justify-between p-4 items-center bg-white border border-2 border-solid border-[#D9D9D9] w-full hover:bg-[#efb4b4]" onClick={() => handleNavigateForProduct(product.id)}>
        <div className="w-[50px] h-[50px]"><img src={product.thumbnailImage} alt={product.name} className="w-full h-full object-cover" /></div>
        <div className="flex flex-col justify-between items-center gap-[10px] text-base"><p className="font-bold lg:text-xl text-base">{product.name}</p></div>
      </div>
    )) : <div className="font-bold p-4">Không tìm thấy sản phẩm phù hợp!</div>}
  </div>}
</div>

      <div className="md:flex lg:flex-row flex-col md:gap-[10px] md:items-center md:block hidden">
        <div className="flex gap-[2px] items-center hover:text-[#DF6A6A]" onClick={handleAddToCart}>
          <span className="font-bold xl:text-lg text-sm text-[#7D7D7D] mr-1 hover:text-[#DF6A6A]">
            GIỎ HÀNG</span>
          <div className="relative">
          <ShoppingCartIcon className="text-[#7D7D7D] xl:w-[25px] xl:h-[25px] w-[20px] height-[20px] hover:text-[#DF6A6A] " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
