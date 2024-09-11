import UserAdd from "./components/UserAdd";
import UserList from "./components/UserList";

const UserIndexPage = () => {
  return (
    <div className="space-y-4">
      <UserAdd />
      <UserList />
    </div>
  );
};
export default UserIndexPage;
