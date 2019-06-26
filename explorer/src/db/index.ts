import api from "../ApiServer";

const addNewServer = async (server: any) => {
  return api.post("/servers", server).then(resp => resp.data);
};
const updateServer = async ({ id, ...rest }: any) => {
  return api.put(`/servers/${id}`, rest).then(resp => resp.data);
};
const deleteServer = async (id: string) => {
  return api.delete(`/servers/${id}`);
};
const setDarkMode = async (isThemeDark: boolean) => {
  return api
    .post("/config", {
      isThemeDark
    })
    .then(resp => {
      console.log(resp.data);
      return resp.data;
    });
};
const isThemeDark = async () => {
  return api.get("/config").then(resp => resp.data.isThemeDark);
};
const fetchAllServers = (): any => {
  return api.get("/servers").then(resp => resp.data);
};
export {
  addNewServer,
  updateServer,
  fetchAllServers,
  deleteServer,
  setDarkMode,
  isThemeDark
};
