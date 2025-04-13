import { type ReactNode } from 'react';
import { redirect } from 'next/navigation';

// Components
import Link from 'next/link';
import Image from 'next/image';

// Actions
import { isAuthenticated } from '@/lib/actions/auth.actions';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect('/sign-in');

  return (
    <div className="root-layout">
      <nav>
        <Link className="flex items-center gap-2 w-fit" href="/">
          <Image src="/logo.svg" alt="Logo" height={32} width={38}/>
          <h2 className="text-primary-100">Interview Prep</h2>
        </Link>
      </nav>
      { children }
    </div>
  );
};

export default RootLayout;
