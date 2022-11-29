import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col gap-4">
      <nav className="flex justify-around p-2">
        <Link href="/">
          <div>Home</div>
        </Link>
        <div>Recipes</div>
        <div>Sign In</div>
      </nav>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
