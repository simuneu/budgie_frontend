import api from "../axiosConfig";

export const useStatistics = () => {
  const getDailyExpense = async (year: number, month: number) => {
    const res = await api.get(`/statistics/${year}/${month}/daily`);
    return res.data.data ?? [];
  };

  const getWeeklyExpense = async (year: number, month: number) => {
    const res = await api.get(`/statistics/${year}/${month}/weekday`);
    
    const list = Array.isArray(res.data.data) ? res.data.data : [];

    return list.map((item: { weekday: number; totalAmount: number }) => ({
      weekday: item.weekday,
      totalAmount: item.totalAmount,
    }));
  };

  const getTop3 = async (year: number, month: number) => {
    const res = await api.get(`/statistics/summary/top3/${year}/${month}`);
    return res.data.data ?? [];
  };

  const getCompare = async (year: number, month: number) => {
    const res = await api.get(`/statistics/summary/compare/${year}/${month}`);
    return res.data.data ?? null; 
  };

  return { getDailyExpense, getWeeklyExpense, getTop3, getCompare };
};
