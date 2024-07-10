"use client";

//React-Next
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

//UI KIT
import {
  DataGridRef,
  DataGridTypes,
  Editing,
} from "devextreme-react/data-grid";
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
import { getCardsByUserId, updateCard } from "@/app/Services/cards";
import ComponentHeader from "@/app/Components/ComponentHeader";
import notify from "devextreme/ui/notify";

interface UserCardProps {
  userId?: number;
}

const ProductTable = ({ userId }: UserCardProps) => {
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

  //Handlers
  const handleUpdate = async (e: DataGridTypes.SavedEvent) => {
    if (userCard?.id) {
      try {
        await updateCard(userCard?.id, e.changes[0].data);
        showNotification("updated", "success");
      } catch (error) {
        showNotification("failed to update", "error");
      }
    } else {
      showNotification("Card not found", "error");
    }
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
            onSaved={(e) => handleUpdate(e)}
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
            <Editing
              mode="row"
              allowUpdating={true}
              allowDeleting={true}
              allowAdding={true}
            />
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

export default ProductTable;
