import { create } from "zustand";

const userConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],

  // setMessage: (newMessageOrArray, append = false) =>
  //   set((state) => ({
  //     messages: append
  //       ? [...state.messages, ...[].concat(newMessageOrArray)]
  //       : [].concat(newMessageOrArray),
  //   })),
  setMessage: (messages) => set({ messages }),
}));

export default userConversation;
