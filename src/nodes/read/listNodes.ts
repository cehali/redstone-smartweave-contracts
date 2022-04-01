import { NodesState, NodesInput, ListNodesInputData } from '../types';

export const listNodes = (state: NodesState, input: NodesInput) => {
  const data = input.data as ListNodesInputData;
  let nodesArray = Object.keys(state.nodes);

  if (!!data?.startAfter) {
    nodesArray = nodesArray.slice(data.startAfter);
  }

  if (!!data?.limit) {
    nodesArray = nodesArray.slice(0, data.limit);
  }

  return { result: nodesArray };
};
