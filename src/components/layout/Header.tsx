import { getContentByKey } from '@/lib/content-server';
import HeaderScrollWrapper from './HeaderScrollWrapper';

export default async function Header() {
  // Load logo server-side
  const logoUrl = await getContentByKey('siteLogo') as string || '';
  
  return (
    <HeaderScrollWrapper logoUrl={logoUrl} />
  );
}
