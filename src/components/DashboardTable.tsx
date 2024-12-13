import {Column} from "react-table"
import TableHOC from "./TableHOC";


interface UserType {
  id: number;
  name: string;
  status: string;
  gender: string;
  region: string;
  registeredAt: string;
  email: string;
  dob: string;  // Added dob to match the User interface
}

const columns: Column<UserType>[] = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "DOB",
    accessor: "dob",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
];

const DashboardTable = ({ data = [] }: { data: UserType[] }) => {
  return TableHOC<UserType>(columns, data, "transaction-box", "Last Active Users")();
};

export default DashboardTable;
