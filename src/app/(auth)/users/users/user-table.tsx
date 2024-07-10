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
import useExportDataGrid from "@/hooks/useExportDataGrid";

//Types
import { Card, User } from "@/lib/types";

//Services
import { getAllUser } from "@/services/user";
import ComponentHeader from "@/components/ComponentHeader";
import { useRouter } from "next/navigation";
import notify from "devextreme/ui/notify";

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
        setUserList(users?.data || []);
      } catch (error) {
        showNotification(error as string, "error");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  //Callbacks
  const showNotification = useCallback((message: string, type: string) => {
    notify(
      {
        message: message,
        height: 45,
        width: 150,
        minWidth: 200,
        type: type,
        displayTime: 3500,
        animation: {
          show: {
            type: "fade",
            duration: 400,
            from: 0,
            to: 1,
          },
          hide: { type: "fade", duration: 40, to: 0 },
        },
      },
      {
        position: "top right",
      }
    );
  }, []);
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
