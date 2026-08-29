import IdleLogout from "@/components/IdleLogout";

export default function AdminLayout({ children }) {
  return (
    <>
      <IdleLogout />
      {children}
    </>
  );
}
