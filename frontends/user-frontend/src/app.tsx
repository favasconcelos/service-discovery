import { useEffect, useState } from 'react';

import { getUser, getUsers } from '@workspace/user-library';

interface User {
  id: string;
  name: string;
  address: string;
  age: number;
}

function UserList({
  loading,
  users,
  onSelect,
}: { loading: boolean; users: Array<User>; onSelect: (user: User | null) => void }) {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border rounded bg-gray-800 flex flex-col gap-2">
      {users.map((user) => (
        <button key={user.id} type="button" className="hover:bg-gray-700 p-4 text-start" onClick={() => onSelect(user)}>
          {user.name}
        </button>
      ))}
    </div>
  );
}

export function UserView({ loading, user }: { loading: boolean; user: User }) {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border rounded bg-gray-800 p-4">
      <div>Name: {user.name}</div>
      <div>Address: {user.address}</div>
      <div>Age: {user.age}</div>
    </div>
  );
}

export function App() {
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [users, setUsers] = useState<Array<User>>([]);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoadingUsers(true);
        const users = await getUsers();
        setUsers(users);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingUsers(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function load(userId: string) {
      try {
        setLoadingUser(true);
        const user = await getUser({ userId });
        setUser(user);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingUser(false);
      }
    }
    if (user?.id) {
      load(user.id);
    }
  }, [user?.id]);

  return (
    <div className="w-screen h-screen bg-gray-950 text-white">
      <div className="flex flex-col gap-4 container mx-auto py-10">
        <UserList loading={loadingUsers} users={users} onSelect={setUser} />
        {user ? <UserView loading={loadingUser} user={user} /> : null}
      </div>
    </div>
  );
}
