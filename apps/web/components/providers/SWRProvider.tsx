
'use client';

import { SWRConfig } from 'swr';
import React from 'react';
import { fetcher } from '@/lib/fetcher';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig 
      value={{
        fetcher,
        revalidateOnFocus: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}