import failMessage from "../components/LoadingFrame/FailMessage.ts";

const getOrderById = async (userId: string | null, accessToken: string | null) => {
    const response = await fetch(`http://localhost:8686/orders/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    });
  
    if (!response.ok) {
      failMessage("Có vấn đề đã xảy ra!")
    }
  
    const data = await response.json();
    return data;
  };
  

export default getOrderById;