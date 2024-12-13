import { ReactElement, useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Column } from "react-table";
import TableHOC from "../components/TableHOC";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/slices/usersSlice";
import { RootState, AppDispatch } from "../redux/store";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

// Assuming the `User` type in the state is like this:
interface User {
  id: string;
  name: string;
  gender: string;
  email: string;
  role: string;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Users = () => {
  const [data, setData] = useState<DataType[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const deleteUser = async (id: string) => {
    try {
      // Make a DELETE request to the server
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh user data by refetching from the server
        dispatch(fetchUsers());
      } else {
        console.error("Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => {
    // Map `users` data to `DataType` to match the table
    const formattedData = users.map((user: User) => {
      const avatarSrc =
        user.gender.toLowerCase() === "male" ? "/male.png" : "/female.png"; // Adjust paths if public folder structure differs

      return {
        avatar: (
          <img
            style={{ borderRadius: "50%" }}
            src={avatarSrc}
            alt={user.name}
          />
        ),
        name: user.name, // Ensure 'name' is available from the `User` type
        email: user.email,
        gender: user.gender,
        role: user.role, // Ensure `role` exists in your Redux store `User` type
        action: (
          <button onClick={() => deleteUser(user.id)}>
            <FaTrash />
          </button>
        ),
      };
    });

    setData(formattedData);
  }, [users]);

  const Table = TableHOC<DataType>(
    columns,
    data,
    "dashboard-product-box",
    "Users",
    true
  );

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && <Table />}
      </main>
    </div>
  );
};

export default Users;
