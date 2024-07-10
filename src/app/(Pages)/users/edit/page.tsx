"use client";

//React-Next
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

//UI KIT
import Form, {
  GroupItem,
  RequiredRule,
  Item,
  FormRef,
  PatternRule,
  EmailRule,
  ButtonItem,
} from "devextreme-react/form";
import { confirm, custom } from "devextreme/ui/dialog";
import notify from "devextreme/ui/notify";
import { ButtonType } from "devextreme/common";

//Types
import { User } from "@/app/Lib/types";

//Services
import { deleteUser, getUser, updateUser } from "@/app/Services/user";

//Components
import ProductTable from "./productTable";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Edit = () => {
  //Hooks
  const searchParams = useSearchParams();
  const formRef = useRef<FormRef>(null);
  const router = useRouter();

  //Memoization
  const id = useMemo(() => {
    return searchParams.get("id");
  }, [searchParams]);

  //State
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  //Handlers
  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void; stopPropagation: () => void }) => {
      e.preventDefault();
      e.stopPropagation();
      if (formRef.current) {
        const formData = formRef.current.instance().option("formData") as User;
        setLoading(true);
        try {
          await updateUser(Number(id), formData);
          showNotification("Updated", "success");
        } catch (error) {
          showNotification("Failed to update", "error");
        } finally {
          setLoading(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );
  const handleDelete = async () => {
    let result = confirm(
      user?.username + " will be deleted are you sure?",
      "Confirm"
    );
    result.then(async (dialogResult) => {
      if (dialogResult === true) {
        if (user?.id) {
          try {
            await deleteUser(user?.id);
            showNotification(`${user.username} deleted`, "success");
            router.push("/users");
          } catch (error) {
            showNotification("failed to delete", "error");
          }
        }
      }
    });
  };

  //Effects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser(Number(id));
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchData();
  }, [id]);

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
    <div className="space-y-2">
      <form onSubmit={handleSubmit}>
        <Form
          showColonAfterLabel={true}
          showValidationSummary={true}
          labelMode="floating"
          formData={user}
          ref={formRef}
          className="flex flex-col"
        >
          <GroupItem colCount={1} caption={user?.firstName}>
            <GroupItem
              colCountByScreen={{
                xs: 1,
                sm: 2,
                md: 5,
                lg: 7,
              }}
              caption="Personal"
            >
              <Item dataField="firstName" caption="First Name">
                <RequiredRule message="First Name is required" />
              </Item>
              <Item dataField="lastName" caption="Last Name">
                <RequiredRule message="Last Name is required" />
              </Item>
              <Item dataField="age" caption="Age">
                <RequiredRule message="Age is required" />
                <PatternRule pattern={/^\d+$/} message="Age must be a number" />
              </Item>
              <Item dataField="gender" caption="Gender" />

              <Item dataField="username" caption="Username">
                <RequiredRule message="Username is required" />
              </Item>
              <Item dataField="password" caption="Password">
                <RequiredRule message="Password is required" />
              </Item>
              <Item dataField="birthDate" caption="Birth Date" />
              <Item
                dataField="bloodGroup"
                caption="Blood Group"
                editorType="dxSelectBox"
                editorOptions={{ items: bloodGroups }}
              />
              <Item dataField="height" caption="Height">
                <PatternRule
                  pattern={/^\d+(\.\d+)?$/}
                  message="Height must be a number"
                />
              </Item>
              <Item dataField="weight" caption="Weight">
                <PatternRule
                  pattern={/^\d+(\.\d+)?$/}
                  message="Weight must be a number"
                />
              </Item>
              <Item dataField="eyeColor" caption="Eye Color" />
              <Item dataField="hair.color" caption="Hair Color" />
              <Item dataField="hair.type" caption="Hair Type" />
              <Item dataField="university" />
            </GroupItem>
            <GroupItem colCount={4}>
              <GroupItem caption="Adress">
                <Item dataField="address.address" />
                <Item dataField="address.city" />
                <Item dataField="address.state" />
                <Item dataField="address.stateCode" />
                <Item dataField="address.postalCode" />
                <Item dataField="address.country" />
              </GroupItem>
              <GroupItem caption="Contact Information">
                <Item dataField="email" caption="Email">
                  <RequiredRule message="Email is required" />
                  <EmailRule message="Email is invalid" />
                </Item>
                <Item dataField="phone" caption="Phone">
                  <RequiredRule message="Phone is required" />
                </Item>
              </GroupItem>
              <GroupItem caption="Crypto">
                <Item dataField="crypto.coin" caption="Coin" />
                <Item dataField="crypto.wallet" caption="Wallet" />
                <Item dataField="crypto.network" caption="Network" />
              </GroupItem>
              <GroupItem caption="Company">
                <Item dataField="company.department" caption="Coin" />
                <Item dataField="company.name" caption="Wallet" />
                <Item dataField="company.title" caption="Network" />
              </GroupItem>
            </GroupItem>
          </GroupItem>
          <GroupItem
            cssClass="buttons-group flex flex-row justify-end gap-4 mt-4" //!TODO not reponsive and they have a gap
            colCountByScreen={{
              xs: 1,
              sm: 2,
              md: 2,
              lg: 2,
            }}
          >
            <ButtonItem
              cssClass="max-w-[120px]"
              buttonOptions={{
                text: loading ? "Loading..." : "Delete",
                icon: loading ? "spinner" : "trash",
                type: "danger" as ButtonType,
                disabled: loading,
                onClick: () => handleDelete(),
                width: "120px",
              }}
            />
            <ButtonItem
              cssClass="max-w-[120px]"
              buttonOptions={{
                text: loading ? "Loading..." : "Save",
                icon: loading ? "spinner" : "save",
                type: "default" as ButtonType,
                useSubmitBehavior: true,
                disabled: loading,
                width: "120px",
              }}
            />
          </GroupItem>
        </Form>
      </form>
      <ProductTable key={"editingProductTable"} userId={user?.id} />
    </div>
  );
};

export default Edit;
