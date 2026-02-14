import axios from "axios";
import { TeamMember } from "@/shared/types/TeamMember";

const API_BASE_URL = "http://localhost:8080/api/team";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const teamApi = {
  getAllMembers: async (): Promise<TeamMember[]> => {
    const response = await api.get<TeamMember[]>("");
    return response.data;
  },

  getMemberById: async (id: number): Promise<TeamMember> => {
    const response = await api.get<TeamMember>(`/${id}`);
    return response.data;
  },

  scrapeMembers: async (): Promise<TeamMember[]> => {
    const response = await api.post<TeamMember[]>("/scrape");
    return response.data;
  },
};
