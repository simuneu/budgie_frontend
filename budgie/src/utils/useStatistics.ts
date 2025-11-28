import axios from "axios";

export const useStatistics = () => {
  const getDailyExpense = async (year: number, month: number) => {
    const res = await axios.get(`/statistics/${year}/${month}/daily`);
    return res.data;
  };

  const getWeeklyExpense = async (year: number, month: number) => {
    const res = await axios.get(`/statistics/${year}/${month}/weekday`);
     return res.data.map((item: any) => ({
    weekday: item.weekly,          // ← 여기 1줄이 핵심
    totalAmount: item.totalAmount,
  }));
  };

  const getTop3 = async (year: number, month: number) => {
    const res = await axios.get(`/statistics/summary/top3/${year}/${month}`);
    return res.data;
  };

  const getCompare = async (year: number, month: number) => {
    const res = await axios.get(`/statistics/summary/compare/${year}/${month}`);
    return res.data;
  };

  return { getDailyExpense, getWeeklyExpense, getTop3, getCompare };
};
