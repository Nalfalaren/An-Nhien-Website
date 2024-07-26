import React, { useContext, useEffect } from "react";
import { AddUser, Customer } from "../../interface/IUSerInfo";
import { useState } from "react";
import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { ClickAdmin } from "../../context/AdminController.tsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useAccessToken from "../../composables/getAccessToken.ts";
import useRole from "../../composables/getRole.ts";
import SuccessMessage from "../LoadingFrame/SuccessMessage.ts";
const AdminContent = () => {
  const [customerInfo, setCustomerInfo] = useState<AddUser[]>([]);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [searchResult, setSearchResult] = useState("");
  const navHeader = useContext(ClickAdmin);
  const role = useRole();
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "full_name", headerName: "Họ và tên", width: 300 },
    { field: "email", headerName: "Email", width: 300 },
    { field: "phone_number", headerName: "Số điện thoại", width: 200 },
    { field: "address", headerName: "Địa chỉ", width: 300 },
    { field: "date_of_birth", headerName: "Ngày sinh", width: 200 },
    { field: "gender", headerName: "Giới tính", width: 150 },
    {
      field: "",
      headerName: "",
      width: 150,
      renderCell: (params) => (
        <div className="flex flex-row gap-[40px]">
        {role === 'ADMIN' && (
          <div
            onClick={(event) => {
              event.stopPropagation();
              handleEditClick(params);
            }}
          >
            <EditIcon className="text-blue-500" />
          </div>
        )}
        {role === 'ADMIN' && (
          <div
            onClick={(event) => {
              event.stopPropagation();
              const userConfirmed = window.confirm("Bạn có muốn xóa khách hàng này?");
              if (userConfirmed) {
                  handleDeleteClick(params);
              }
            }}
          >
            <DeleteIcon className="text-red-500" />
          </div>
        )}
      </div>
      ),
    },
  ];

  const navigate = useNavigate();
  const { accessToken, loading } = useAccessToken();

  useEffect(() => {
    const fetchCustomerList = async () => {    
      try {
        if (loading) return; 
        const response = await fetch(
          "http://localhost:8686/admin/users/role=CUSTOMER",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const updatedData = data.map((customer) => ({
            ...customer,
            date_of_birth: new Date(customer.date_of_birth)
              .toISOString()
              .split("T")[0],
          }));
          setCustomerInfo(updatedData);
          console.log(customerInfo);
          
          
        } else {
          const errorData = await response.json();
          setEmptyMessage(errorData.error);
        }
      } catch (error) {
        console.log('Failed');
        
      }
    };

    fetchCustomerList();
  }, [accessToken]);

  const handleSearch = (e: any) => {
    setSearchResult(e.target.value);
  };

  const handleRowClick = (params: any) => {
    const customerId = params.row.id;
    navigate(`/admin/users/customer/${customerId}`);
    navHeader.handleSetMode("customer-detail");
  };

  const handleEditClick = (params: any) => {
    const customerId = params.row.id;
    navigate(`/admin/users/${customerId}/modify_customer`);
  };

  const handleDeleteClick = async (params: any) => {
    const customerId = params.row.id;
    if (loading) return; 
    const response = await fetch(
      `http://localhost:8686/admin/users/${customerId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const deletedData = await response.json();
    if (response.ok) {
      SuccessMessage(deletedData.result)
      setCustomerInfo((data) =>
        data.filter((customer) => customer.id !== customerId)
      );
    }
  };
  return (
    <div className="absolute top-[55%] left-[57%] transform -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] bg-[#D9D9D9]">
      <div>
        <div className="flex flex-row justify-between items-center px-8 py-4">
          <div>
            <h1 className="font-bold text-2xl">Quản lý khách hàng</h1>
          </div>
          <div className="flex flex-row justify-between items-center gap-[20px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm"
                className="rounded-[50px] border-[E2E2E2] border-2 border-solid p-3 bg-[#E9ECEF]"
                value={searchResult}
                onChange={handleSearch}
              />

              <div className="absolute right-3 top-3">
                <SearchIcon className="text-[#A2A3A6]" />
              </div>
            </div>
            <Button
              variant="contained"
              className="bg-[#899BE0]"
              disabled={role !== "ADMIN"}
              onClick={() => navigate("/admin/users/add_customers")}
            >
              <div className="flex items-center gap-[10px]">
                <GroupAddIcon />
                <span>Thêm khách hàng</span>
              </div>
            </Button>
          </div>
        </div>
        {customerInfo ? (
          <div>
            <DataGrid
              rows={customerInfo.filter((customer) =>
                customer.full_name
                  .toLowerCase()
                  .includes(searchResult.toLowerCase())
              )}
              columns={columns}
              onRowClick={handleRowClick}
              paginationModel={paginationModel}
              onPaginationModelChange={(model) => setPaginationModel(model)}
              pageSizeOptions={[10]}
            />
          </div>
        ) : (
          <div className="text-center py-4">
            <h1 className="text-2xl text-red-500">{emptyMessage}</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContent;
