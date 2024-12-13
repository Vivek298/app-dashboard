import { useState, useEffect } from "react";
import { FaRegBell } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import userImg from "../assets/userpic.png";
import { BarChart } from "../components/Charts";
import Table from "../components/DashboardTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/slices/usersSlice";
import { AppDispatch, RootState } from "../redux/store";

// Define User interface
interface User {
  id: number;
  name: string;
  status: string;
  gender: string;
  region: string;
  registeredAt: string;
  email: string;
  dob: string; // Added `dob` property to match UserType
}

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users } = useSelector((state: RootState) => state.users);

  // State for filters
  const [region, setRegion] = useState<string>("All");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Apply filters
  useEffect(() => {
    let filtered: User[] = users;

    // Filter by region
    if (region !== "All") {
      filtered = filtered.filter((user) => user.region === region);
    }

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      filtered = filtered.filter((user) => {
        const regDate = new Date(user.registeredAt);
        return regDate >= startDate && regDate <= endDate;
      });
    }

    setFilteredUsers(filtered);
  }, [users, region, dateRange]);

  // Calculate statistics
  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter((user) =>
    user.status ? user.status.toLowerCase() === "active" : false
  ).length;
  const deletedUsers = filteredUsers.filter((user) =>
    user.status ? user.status.toLowerCase() === "inactive" : false
  ).length;
  const femaleUsers = filteredUsers.filter((user) =>
    user.gender ? user.gender.toLowerCase() === "female" : false
  ).length;

  const activeUserPercentage = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
  const deletedUserPercentage = totalUsers > 0 ? (deletedUsers / totalUsers) * 100 : 0;
  const femaleUserPercentage = totalUsers > 0 ? (femaleUsers / totalUsers) * 100 : 0;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        <div className="bar">
          <FaRegBell />
          <img src={userImg} alt="User" />
        </div>

        <section className="widget-container">
          <WidgetItem
            percent={100} // Total Users is always 100%
            amount={true}
            value={totalUsers}
            heading="Total Users"
            color="rgb(207, 14, 207)"
          />
          <WidgetItem
            percent={activeUserPercentage}
            value={activeUsers}
            heading="Active Users"
            color="rgb(0 198 202)"
          />
          <WidgetItem
            percent={deletedUserPercentage}
            value={deletedUsers}
            heading="Inactive Users"
            color="rgb(255 196 0)"
          />
          <WidgetItem
            percent={femaleUserPercentage}
            value={femaleUsers}
            heading="Female Users"
            color="rgb(255 105 180)"
          />
        </section>

        <section className="graph-container">
          <div className="revenue-chart">
            <h2>Active & Inactive Users</h2>
            <BarChart
              data_2={[300, 144, 433, 655, 237, 755, 190]}
              data_1={[200, 444, 343, 556, 778, 455, 990]}
              title_1="Active Users"
              title_2="Inactive Users"
              bgColor_1="rgb(207, 14, 207)"
              bgColor_2="plum"
            />
          </div>

          <div className="dashboard-categories">
            <h2>Analytics Filters</h2>
            <div className="filters">
              <div className="filter-item">
                <label htmlFor="region">Region</label>
                <select
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="All">All Regions</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                  <option value="Africa">Africa</option>
                  <option value="South America">South America</option>
                </select>
              </div>

              <div className="filter-item">
                <label htmlFor="start-date">Start Date</label>
                <input
                  type="date"
                  id="start-date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>

              <div className="filter-item">
                <label htmlFor="end-date">End Date</label>
                <input
                  type="date"
                  id="end-date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="transaction-container">
          {filteredUsers.length === 0 ? (
            <div>No users match the current filters.</div>
          ) : (
            <Table data={filteredUsers} />
          )}
        </section>
      </main>
    </div>
  );
};

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `${value}` : value}</h4>
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(${color} ${(percent / 100) * 360}deg, rgb(255, 255, 255) 0)`,
      }}
    >
      <span style={{ color }}>{Math.round(percent)}%</span>
    </div>
  </article>
);

export default Dashboard;
