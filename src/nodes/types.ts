export interface NodesState {
  canEvolve: boolean;
  contractAdmins: string[];
  nodes: { [key in string]: Node }
}

interface Node {
  name: string;
  logo: string
  description: string;
  dataFeedId: string;
  evmAddress: string;
  ipAddress: string;
  url?: string;
}

export interface NodesAction {
  input: NodesInput;
  caller: string;
}

export interface NodesInput {
  function: 'listNodes' |
    'getNodeDetails' | 
    'registerNode' |
    'updateNodeDetails' |
    'removeNode';
  data: ListNodesInputData | 
    GetNodeDetailsInputData | 
    RegisterNodeInputData | 
    UpdateNodeDetailInputData;
}

export interface ListNodesInputData {
  limit?: number;
  startAfter?: number;
}

export interface GetNodeDetailsInputData {
  address: string;
}

export type RegisterNodeInputData = Node;

export type UpdateNodeDetailInputData = Partial<Node>;
