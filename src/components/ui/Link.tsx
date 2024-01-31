import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

const Link: React.FC<
  RouterLinkProps & {
    className?: string;
    title?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    children?: React.ReactNode;
  }
> = ({ className, children, ...props }) => {
  return (
    <RouterLink {...props} className={className}>
      {children}
    </RouterLink>
  );
};

export default Link;
