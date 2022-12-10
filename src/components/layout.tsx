interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col gap-4 py-4">
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
