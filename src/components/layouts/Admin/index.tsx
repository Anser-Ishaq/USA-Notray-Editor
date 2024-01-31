import cn from 'classnames';
import { Outlet } from 'react-router-dom';

import Link from '@/components/ui/Link';
import { siteSettings } from '@/settings/siteSettings';

const SideBarGroup = () => {
  const menuItems = siteSettings?.sidebarLinks?.admin;

  return (
    <>
      {menuItems?.map((menu, index) => (
        <div
          className={cn(
            'flex flex-col px-5 py-5 border-b hover:bg-slate-100 hover:cursor-pointer',
          )}
          key={index}
        >
          <Link to={menu?.href}>{menu?.label}</Link>
        </div>
      ))}
    </>
  );
};

const AdminLayout: React.FC<{ children?: React.ReactNode }> = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150">
      <div className="flex flex-1">
        <aside
          className={cn(
            'relative bottom-0 z-10 hidden min-h-screen h-full w-72 bg-white shadow transition-[width] duration-300 ltr:left-0 ltr:right-auto rtl:right-0 rtl:left-auto lg:block',
          )}
        >
          <div className="sidebar-scrollbar h-full w-full overflow-x-hidden">
            <div className="h-full w-full">
              <SideBarGroup />
            </div>
          </div>
        </aside>
        <main
          className={cn(
            'relative flex w-full flex-col justify-start transition-[padding] duration-300',
          )}
        >
          <div className="h-full p-5 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
