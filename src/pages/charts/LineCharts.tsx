import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "../../components/AdminSidebar";
import { LineChart } from "../../components/Charts";
import { fetchUserRegistrationTrend, selectUserRegistrationTrend } from "../../redux/slices/trendSlice";
import { AppDispatch } from "../../redux/store";

const LineCharts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { trend, loading, error } = useSelector(selectUserRegistrationTrend);

  useEffect(() => {
    dispatch(fetchUserRegistrationTrend());
  }, [dispatch]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Line Charts</h1>

        <section>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {trend && (
            <LineChart
              data={trend.registrations}
              backgroundColor={"hsla(269,80%,40%,0.4)"}
              borderColor={"hsl(269,80%,40%)"}
              label="User Registrations"
              labels={trend.months}
            />
          )}
          <h2>User Registration Trend</h2>
        </section>
      </main>
    </div>
  );
};

export default LineCharts;
