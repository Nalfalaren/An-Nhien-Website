import { Order } from "../interface/IUSerInfo";

const fetchBillDetail = async (accessToken : string | null) => {
    try {
      const response = await fetch("http://localhost:8686/orders/admin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data: Order[] = await response.json();
        return data;
      } else {

      }
    } catch (error) {
      console.log("Failed");
    }
  };

  export default fetchBillDetail;