import Topbar from "../../../components/Topbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div suppressHydrationWarning>
      <Topbar />
      <main className="p-5">{children}</main>
    </div>
  );
}
