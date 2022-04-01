import { NodesState, NodesAction, RegisterNodeInputData } from '../types';

declare const ContractError;

export const registerNode = (state: NodesState, action: NodesAction) => {
  const data = action.input.data as RegisterNodeInputData;

  const isValidData = data.name &&
    data.logo &&
    data.description &&
    data.dataFeedId &&
    data.evmAddress &&
    data.ipAddress;
  
  if (!isValidData) {
    throw new ContractError('Invalid node data');
  }

  state.nodes[action.caller] = data;

  return { state };
};
