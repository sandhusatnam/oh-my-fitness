export interface UpdateWeightResponse {
  message: string;
  entry: {
    _id: string;
    date: string;
    weight: number;
  };
}
