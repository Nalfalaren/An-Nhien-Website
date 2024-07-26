import React, { useContext, useEffect } from "react";
import { Customer } from "../../interface/IUSerInfo";
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
import confirmMessage from "../LoadingFrame/ConfirmMessage.ts";
const AdminEmployeeContent = () => {
  const [customerInfo, setCustomerInfo] = useState<Customer[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [searchResult, setSearchResult] = useState("");
  const navHeader = useContext(ClickAdmin);
  const role = useRole();
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "full_name", headerName: "Họ và tên", width: 250 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phone_number", headerName: "Số điện thoại", width: 200 },
    { field: "address", headerName: "Địa chỉ", width: 200 },
    { field: "date_of_birth", headerName: "Ngày sinh", width: 200 },
    { field: "role", headerName: "Chức vụ", width: 200 },
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
              const userConfirmed = window.confirm("Bạn có muốn xóa nhân viên  này?");
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
        const roles = ["ADMIN", "MANAGER", "EMPLOYEE"];
        const fetchPromises = roles.map((role) => fetch(`http://localhost:8686/admin/users/role=${role}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        })
        );
        
        const responses = await Promise.all(fetchPromises);
        const data = await Promise.all(
          responses.map((response) => response.json())
        );
        const combinedData = data.reduce((acc, curr) => acc.concat(curr), []);
        const updatedData = combinedData.map((customer) => ({
          ...customer,
          date_of_birth: new Date(customer.date_of_birth)
            .toISOString()
            .split("T")[0],
        }));
        setCustomerInfo(updatedData);
        
      } catch (error) {
        console.error("Failed to fetch customer list:", error);
        console.log(customerInfo);
        
      }
    };

    fetchCustomerList();
 }, [accessToken]); 


  const handleSearch = (e: any) => {
    setSearchResult(e.target.value);
  };

  const handleRowClick = (params: any) => {
    const customerId = params.row.id;
    navigate(`/admin/users/employee/${customerId}`);
    navHeader.handleSetMode("employee-detail");
  };

  const handleEditClick = (params: any) => {
    const customerId = params.row.id;
    navigate(`/admin/users/${customerId}/modify_employee`);
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
          Authorization: `Bearer ${accessToken}`
        },
      }
    );
    if (response.ok) {
      SuccessMessage((await response.json()).result)
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
            <h1 className="font-bold text-2xl">Quản lý nhân viên</h1>
          </div>
          <div className="flex flex-row justify-between items-center gap-[20px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm"
                className="rounded-[50px] border-[E2E2E2] border-2 border-solid p-3 bg-[#E9ECEF]"
                onChange={handleSearch}
              />
              <div className="absolute right-3 top-3">
                <SearchIcon className="text-[#A2A3A6]" />
              </div>
            </div>
            <div>
              <Button variant="contained" className="bg-[#899BE0]" disabled={role !== 'ADMIN'}>
                <div
                  className="flex items-center gap-[10px]"
                  onClick={() => navigate("/admin/users/add_employees")}
                >
                  <GroupAddIcon />
                  <span>Thêm nhân viên</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div>
        {customerInfo ? (
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
        ) : (
          <div className="text-center py-4">
            <h1 className="text-2xl text-red-500">Không có nhân viên!</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmployeeContent;
