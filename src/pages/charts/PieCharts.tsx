import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "../../components/AdminSidebar";
import { PieChart } from "../../components/Charts";
import { fetchUsers, selectUserStats } from "../../redux/slices/usersSlice";
import { AppDispatch, RootState } from "../../redux/store";

const PieCharts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { active, inactive } = useSelector(selectUserStats);
  const { loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Pie Charts</h1>
        <section>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && (
            <>
              <div>
                <PieChart
                  labels={["Active Users", "Inactive Users"]}
                  data={[active, inactive]}
                  backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
                  offset={[50, 50]}
                />
              </div>
              <h2>Active vs Inactive Users</h2>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default PieCharts;
