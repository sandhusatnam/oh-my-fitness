import axios from '../axios';

export interface WeightHistoryItem {
  _id: string;
  date: string;
  weight: number;
}

export interface GetWeightHistoryResponse {
  weightHistory: WeightHistoryItem[];
}

export const getWeightHistory = async (startDate: string, endDate: string): Promise<GetWeightHistoryResponse> => {
  const response = await axios.get<GetWeightHistoryResponse>(
    `/progress/weight-history?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};
