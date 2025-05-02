'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@repo/ui/components/button';

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const queryTerm = formData.get('search') as string;
          router.push(pathname + '?search=' + queryTerm);
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Search for users</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              id="search"
              name="search"
              type="text"
              className="m-2 border p-2"
            />
            <Button type="submit">Submit</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
