"use client";

//React-Next
import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

//Services
import { Login as LoginRequest } from "../../services/auth/index";

//UI KIT
import Form, {
  SimpleItem,
  RequiredRule,
  FormRef,
  GroupItem,
  Label,
  ButtonItem,
} from "devextreme-react/form";
import { ButtonType } from "devextreme/common";
import Validator from "devextreme/ui/validator";
import notify from "devextreme/ui/notify";
import { signIn } from "next-auth/react";

interface LoginType {
  username: string;
  password: string;
}

const Login = () => {
  //Hooks
  const router = useRouter();

  // Ref
  const formRef = useRef<FormRef>(null);

  // States
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginType>({
    password: "",
    username: "",
  });

  // Callbacks
  const changePasswordMode = useCallback((name: string) => {
    if (formRef.current) {
      const editor = formRef.current.instance().getEditor(name);
      editor?.option(
        "mode",
        editor.option("mode") === "text" ? "password" : "text"
      );
    }
  }, []);

  //Handlers
  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void; stopPropagation: () => void }) => {
      e.preventDefault();
      e.stopPropagation();
      if (!formRef.current) return;

      const formData = formRef.current
        .instance()
        .option("formData") as LoginType;
      setLoading(true);
      // try {
      const loginResponse = await signIn("credentials", {
        ...formData,
        redirect: false,
      });
      if (!loginResponse || loginResponse.error)
        showNotification(loginResponse?.error || "Error on login", "error");
      else router.push("/users");
      // } catch (error) {
      //   showNotification("Failed to Login", "error");
      // } finally {
      setLoading(false);
      // }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
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
  const getPasswordOptions = useCallback(
    () => ({
      mode: "password",
      valueChangeEvent: "keyup",
      onValueChanged: () => {
        const editor = formRef?.current
          ?.instance()
          .getEditor("ConfirmPassword");
        if (editor?.option("value")) {
          const instance = Validator.getInstance(editor.element()) as Validator;
          instance.validate();
        }
      },
      buttons: [
        {
          name: "password",
          location: "after",
          options: {
            stylingMode: "text",
            icon: "eyeopen",
            onClick: () => changePasswordMode("password"),
          },
        },
      ],
    }),
    [changePasswordMode]
  );

  return (
    <div className="p-3 flex h-screen w-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex shadow-lg relative w-full max-w-md bg-white rounded-lg"
      >
        <Form
          className="w-full flex flex-col p-4"
          showColonAfterLabel={true}
          showValidationSummary={true}
          labelMode="floating"
          formData={formData}
          onFieldDataChanged={(e) => {
            if (!e.dataField) return;

            const keyTyped = e.dataField as keyof LoginType;
            setFormData((currentValue) => {
              return {
                ...currentValue,
                [keyTyped]: e.value,
              };
            });
          }}
          ref={formRef}
        >
          <GroupItem caption="Login" cssClass="w-full" colCount={1}>
            <SimpleItem dataField="username">
              <Label text="Username" />
              <RequiredRule message="Username is required" />
            </SimpleItem>
            <SimpleItem
              dataField="password"
              editorOptions={getPasswordOptions()}
            >
              <Label text="Password" />
              <RequiredRule message="Password is required" />
            </SimpleItem>
          </GroupItem>
          <ButtonItem
            cssClass=""
            buttonOptions={{
              text: loading ? "Loading..." : "Login",
              icon: loading ? "spinner" : "to",
              type: "default" as ButtonType,
              useSubmitBehavior: true,
              disabled: loading,
            }}
          />
          {/* <ButtonItem
            cssClass="mt-4"
            buttonOptions={{
              text: loading ? "Loading..." : "Login",
              icon: loading ? "spinner" : "to",
              type: "default" as ButtonType,
              useSubmitBehavior: true,
              disabled: loading,
            }}
          /> */}
        </Form>
      </form>
    </div>
  );
};

export default Login;
