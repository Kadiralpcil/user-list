"use client";

//React-Next
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

//UI KIT
import { DataGridRef, DataGridTypes } from "devextreme-react/data-grid";
import DataGrid, {
  Scrolling,
  Pager,
  Paging,
  Column,
  HeaderFilter,
  FilterRow,
  Export,
  SearchPanel,
  Selection,
  GroupPanel,
  ColumnChooser,
  Item,
  Toolbar,
  StateStoring,
  FilterPanel,
} from "devextreme-react/data-grid";

//Icons
import { FaUser } from "react-icons/fa";

//Hooks
import useExportDataGrid from "@/app/Hooks/useExportDataGrid";

//Types
import { Card, User } from "@/app/Lib/types";

//Services
import { getAllUser } from "@/app/Services/user";
import ComponentHeader from "@/app/Components/ComponentHeader";
import { Button } from "devextreme-react";
import { useRouter } from "next/navigation";

interface UserTableProps {
  onCurrentUserChange: (user: User) => void;
}
const UserTable = ({ onCurrentUserChange }: UserTableProps) => {
  // Hooks
  const dataGridRef = useRef<DataGridRef>(null);
  const onExporting = useExportDataGrid();
  const router = useRouter();

  // States
  const [userList, setUserList] = useState<User[]>([]);

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getAllUser();
        setUserList(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchData();
  }, []);

  //Handlers
  const renderUser = ({ data }: { data: User }) => (
    <div className="flex items-center gap-1 min-h-[2rem] font-semibold">
      <Image
        src={data.image}
        alt={`${data.firstName} ${data.lastName}`}
        width={30}
        height={30}
        style={{ borderRadius: "50%" }}
      />
      <p>{data.firstName}</p>
      <p>{data.lastName}</p>
    </div>
  );
  const renderPhone = ({ data }: { data: User }) => (
    <div className="flex items-center gap-1  min-h-[2rem] justify-center">
      <p className="text-[12px] font-semibold">{data.phone}</p>
    </div>
  );
  const renderMail = ({ data }: { data: User }) => (
    <div className="flex items-center gap-1  min-h-[2rem] justify-center">
      <p className="text-[12px] font-semibold">{data.email}</p>
    </div>
  );
  const onSelectionChanged = useCallback(
    ({ selectedRowsData }: DataGridTypes.SelectionChangedEvent) => {
      if (onCurrentUserChange && typeof onCurrentUserChange === "function") {
        onCurrentUserChange(selectedRowsData[0]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const onRouteDetailPage = (e: DataGridTypes.CellClickEvent) => {
    router.push(`users/edit?id=${e.key.id}`);
  };
  return (
    <>
      <ComponentHeader title="User List" icon={<FaUser />} />
      <DataGrid
        scrolling={{ columnRenderingMode: "standard" }}
        ref={dataGridRef}
        dataSource={userList}
        allowColumnReordering={true}
        columnAutoWidth={true}
        allowColumnResizing={true}
        showRowLines={true}
        showBorders={true}
        showColumnLines={true}
        onCellPrepared={(e) => {
          if (e.rowType === "header") {
            e.cellElement.style.textAlign = "center";
          }
          if (e.rowType === "data") {
            e.cellElement.style.textAlign = "center";
          }
        }}
        onSelectionChanged={onSelectionChanged}
        onExporting={(e: DataGridTypes.ExportingEvent) =>
          onExporting(e, "User List")
        }
      >
        <StateStoring enabled={true} type="localStorage" storageKey="storage" />
        <Toolbar>
          <Item name="groupPanel" />
          <Item name="addRowButton" />

          <Item name="searchPanel" />
          <Item name="columnChooserButton" />
          <Item name="exportButton" />
        </Toolbar>
        <Export enabled={true} formats={["pdf", "excel"]} />
        <ColumnChooser enabled={true} />
        <FilterRow visible={true} />
        <GroupPanel visible={true} />
        <SearchPanel visible={true} placeholder="Search" />
        <FilterPanel visible={false} />
        <HeaderFilter visible={true} />
        <Scrolling rowRenderingMode="virtual" />
        <Paging defaultPageSize={10} />
        <Pager
          visible={true}
          allowedPageSizes={[5, 10, 20, 50, "all"]}
          displayMode="full"
          showPageSizeSelector={true}
          showInfo={true}
          showNavigationButtons={true}
        />
        <Selection mode="single" />

        <Column dataField="firstName" caption="User" cellRender={renderUser} />
        <Column dataField="phone" caption="Phone" cellRender={renderPhone} />
        <Column dataField="email" caption="Email" cellRender={renderMail} />
        <Column
          dataField=""
          caption="Action"
          cellRender={(e: DataGridTypes.CellClickEvent) => (
            <div className="flex gap-2">
              <i
                onClick={() => onRouteDetailPage(e)}
                className="flex justify-center items-center min-h-[2rem] w-full dx-icon-edit text-blue-600 hover:text-blue-400 transition-colors cursor-pointer"
              />
            </div>
          )}
        />
      </DataGrid>
    </>
  );
};

export default UserTable;
