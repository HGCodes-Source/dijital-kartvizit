import IdleLogout from "@/components/IdleLogout";

export default function PanelLayout({ children }) {
  return (
    <>
      <IdleLogout />
      {children}
    </>
  );
}
