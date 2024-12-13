import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/usersSlice"; // Update with the correct path
import { RootState, AppDispatch } from "../../redux/store"; // Update with the correct path
import AdminSidebar from "../../components/AdminSidebar";
import { BarChart } from "../../components/Charts";

const BarCharts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { regions, activeCounts, inactiveCounts, status } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Bar Charts</h1>
        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p>Failed to load data.</p>}
        {status === "succeeded" && (
          <section>
            <BarChart
              data_1={activeCounts}
              data_2={inactiveCounts}
              title_1="Active Users"
              title_2="Inactive Users"
              bgColor_1={`hsl(260,50%,30%)`}
              bgColor_2={`hsl(360,90%,90%)`}
              labels={regions}
            />
            <h2>Active and Inactive Users by Region</h2>
          </section>
          
        )}
      </main>
    </div>
  );
};

export default BarCharts;
