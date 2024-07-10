"use client";

//React-Next
import React, { useEffect, useRef, useState } from "react";
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
  GroupPanel,
  ColumnChooser,
  Item,
  Toolbar,
  StateStoring,
  FilterPanel,
} from "devextreme-react/data-grid";

//Icons
import { FaShoppingCart } from "react-icons/fa";

//Hooks
import useExportDataGrid from "@/app/Hooks/useExportDataGrid";

//Types
import { Card, Product } from "@/app/Lib/types";

//Services
import { getCardsByUserId } from "@/app/Services/cards";
import ComponentHeader from "@/app/Components/ComponentHeader";

interface UserCardProps {
  userId?: number;
}

const UserCard = ({ userId }: UserCardProps) => {
  // Hooks
  const dataGridRef = useRef<DataGridRef>(null);
  const onExporting = useExportDataGrid();

  //States
  const [userCard, setUserCard] = useState<Card | undefined>(undefined);

  //Effects
  useEffect(() => {
    const fetchUserCard = async () => {
      if (!userId) {
        return;
      }
      try {
        const userCardData = await getCardsByUserId(userId);
        setUserCard(userCardData);
      } catch (error) {
        console.error("Failed to fetch user card:", error);
      }
    };

    if (userId) {
      fetchUserCard();
    }
  }, [userId]);

  return (
    <>
      {userId ? (
        <>
          <ComponentHeader title="Product List" icon={<FaShoppingCart />} />
          <DataGrid
            scrolling={{ columnRenderingMode: "standard" }}
            ref={dataGridRef}
            dataSource={userCard?.products}
            allowColumnReordering={true}
            columnAutoWidth={true}
            allowColumnResizing={true}
            showRowLines={true}
            showBorders={true}
            onCellPrepared={(e) => {
              if (e.rowType === "header") {
                e.cellElement.style.textAlign = "center";
              }
              if (e.rowType === "data") {
                e.cellElement.style.textAlign = "center";
                e.cellElement.style.fontWeight = "600";
              }
            }}
            showColumnLines={true}
            onExporting={(e: DataGridTypes.ExportingEvent) =>
              onExporting(e, "Products")
            }
          >
            <StateStoring
              enabled={true}
              type="localStorage"
              storageKey="storage"
            />
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

            <Column
              dataField="title"
              caption="Title"
              cellRender={({ data }: { data: Product }) => (
                <div className="flex items-center gap-1 min-h-[1.5rem] font-semibold">
                  <Image
                    src={data.thumbnail}
                    alt={data.title}
                    width={30}
                    height={30}
                    style={{ borderRadius: "50%" }}
                  />
                  <p>{data.title}</p>
                </div>
              )}
            />
            <Column
              dataField="price"
              caption="Price"
              cellRender={({ data }: { data: Product }) => (
                <div className="flex items-center justify-center gap-1 min-h-[1.5rem] font-semibold">
                  <p>$</p>
                  <p>{data.price}</p>
                </div>
              )}
            />
            <Column
              dataField="quantity"
              caption="Quantitiy"
              cellRender={({ data }: { data: Product }) => (
                <div className="flex items-center justify-center gap-1 min-h-[1.5rem] font-semibold">
                  <p>{data.quantity}</p>
                </div>
              )}
            />
            <Column
              dataField="total"
              caption="Total"
              cellRender={({ data }: { data: Product }) => (
                <div className="flex items-center justify-center gap-1 min-h-[1.5rem] font-semibold">
                  <p>$</p>
                  <p>{data.total.toFixed(2)}</p>
                </div>
              )}
            />
            <Column
              dataField="discountPercentage"
              caption="Discount"
              cellRender={({ data }: { data: Product }) => (
                <div className="flex flex-col items-center justify-center gap-1 min-h-[1.5rem] font-semibold">
                  <div className="flex gap-1 bg-green-400 text-white p-1 rounded ">
                    <p>-</p>
                    <p>% {data.discountPercentage}</p>
                  </div>
                </div>
              )}
            />
            <Column
              dataField="discountedTotal"
              caption="Discounted Total"
              cellRender={({ data }: { data: Product }) => (
                <div className="flex items-center justify-center gap-1 min-h-[1.5rem] font-semibold">
                  <p>$</p>
                  <p>{data.discountedTotal.toFixed(2)}</p>
                </div>
              )}
            />
          </DataGrid>
        </>
      ) : (
        <p>There is no user products</p>
      )}
    </>
  );
};

export default UserCard;
