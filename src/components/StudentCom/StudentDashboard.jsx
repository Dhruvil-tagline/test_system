import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonCom from "../../shared/ButtonCom";
import Table from "../../shared/Table";
import { getRequest } from "../../utils/api";
import { studentDashboardHeader } from "../../utils/staticObj";

const StudentDashboard = () => {
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [exam, setExam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        let response = await getRequest("student/studentExam", user?.token);
        if (response.statusCode === 200) {
          setExam(response.data);
        } else {
          setError(response?.message || "Error occurred");
        }
      } catch (error) {
        setError(error?.message || "Error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.token]);

  const tableData = useMemo(() => {
    return exam.map((val, index) => ({
      Index: index + 1,
      Subject: val.subjectName,
      Email: val.email,
      Notes: val.notes.join(", "),
      Action: val?.Result?.length ? (
        <ButtonCom onClick={() => navigate("/result", { state: val })}>
          View result
        </ButtonCom>
      ) : (
        <ButtonCom
          onClick={() =>
            navigate("/examForm", {
              state: {
                id: val._id,
                subjectName: val.subjectName,
                notes: val.notes,
              },
            })
          }
        >
          Start Exam
        </ButtonCom>
      ),
    }));
  }, [exam]);

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "30px",
          color: "rgb(18, 219, 206)",
          marginBottom: "20px",
          textShadow: "12px 12px  4px black",
        }}
      >
        <h1>Welcome {user?.user?.name}</h1>
        <h1>Role: {user?.user?.role}</h1>
      </div>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Table
          tableData={tableData}
          tableHeader={studentDashboardHeader}
          isLoading={loading}
          minWidth={"900px"}
          error={error}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
