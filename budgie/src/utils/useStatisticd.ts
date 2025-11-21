import axios from "axios";

export const useStatistics = () => {
  const getDailyExpense = async (year: number, month: number) => {
    const res = await axios.get(`/api/statistics/${year}/${month}/daily`);
    return res.data;
  };

  const getWeeklyExpense = async (year: number, month: number) => {
    const res = await axios.get(`/api/statistics/${year}/${month}/weekday`);
    return res.data;
  };

  const getTop3 = async (year: number, month: number) => {
    const res = await axios.get(`/api/statistics/summary/top3/${year}/${month}`);
    return res.data;
  };

  const getCompare = async (year: number, month: number) => {
    const res = await axios.get(`/api/statistics/summary/compare/${year}/${month}`);
    return res.data;
  };

  return { getDailyExpense, getWeeklyExpense, getTop3, getCompare };
};
