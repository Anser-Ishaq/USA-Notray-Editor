import cn from 'classnames';
import { useWindowSize } from 'react-use';

import Link from '@/components/ui/Link';
import { RESPONSIVE_WIDTH } from '@/utils/constants';

const SidebarItem = ({
  href,
  label,
  miniSidebar,
}: {
  href: any;
  icon: any;
  label: string;
  childMenu: [];
  miniSidebar?: boolean;
}) => {
  const { width } = useWindowSize();
  href =
    href && href !== '/' && href?.endsWith('/') ? href?.slice(0, -1) : href;

  return (
    <Link
      to={href}
      className={cn(
        `group flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-gray-700 text-start focus:text-accent ${
          miniSidebar && width >= RESPONSIVE_WIDTH
            ? 'hover:text-accent-hover ltr:pl-3 rtl:pr-3'
            : 'hover:bg-gray-100'
        }`,
      )}
      title={label}
    >
      <span
        className={cn(miniSidebar && width >= RESPONSIVE_WIDTH ? 'hidden' : '')}
      >
        {label}
      </span>
    </Link>
  );
};

export default SidebarItem;
