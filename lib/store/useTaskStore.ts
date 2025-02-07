import { create } from "zustand";

interface TaskStore {
  task_id: number | null;
  selectTask: (id: number | null) => void;
}

const useSelectTaskStore = create<TaskStore>((set) => ({
  task_id: null,
  selectTask: (id) => {
    console.log("Setting task_id:", id); // Debugging
    set({ task_id: id });
  },
}));

export default useSelectTaskStore;
