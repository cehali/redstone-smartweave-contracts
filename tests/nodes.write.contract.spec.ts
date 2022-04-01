import { NodesInput, RegisterNodeInputData } from '../src/nodes/types';
import ContractsTestingEnv from '../src/tools/ContractsTestingEnv';

const contractSourcePath = './src/nodes/nodes.contract.ts';
const caller = 'bYz5YKzHH97983nS8UWtqjrlhBHekyy-kvHt_eBxBBY'

describe('Nodes contract - write', () => {
  const testEnv = new ContractsTestingEnv();
  let contractId: string

  const initialState = {
    canEvolve: true,
    contractAdmins: ['bYz5YKzHH97983nS8UWtqjrlhBHekyy-kvHt_eBxBBY'],
    nodes: {}
  };

  beforeEach(() => {
    contractId = testEnv.deployContract(contractSourcePath, initialState);
  });

  afterEach(() => {
    testEnv.clearContracts();
  });

  describe('registerNode', () => {
    test('should add new node when register', async () => {
      const testNodeDetails = {
        name: 'testName',
        logo: 'testLogo',
        description: 'testDescription',
        dataFeedId: 'testId',
        evmAddress: 'testAddress',
        ipAddress: 'testIP',
        url: 'testUrl'
      };
      const interaction = await testEnv.interact<NodesInput>(caller, contractId, {
        function: 'registerNode',
        data: testNodeDetails
      });
      const node = interaction.state.nodes[caller];
      expect(node).toEqual(testNodeDetails);
    });
   
    test('should add two new nodes when register', async () => {
      const testFirstNodeDetails = {
        name: 'testName1',
        logo: 'testLogo',
        description: 'testDescription',
        dataFeedId: 'testId',
        evmAddress: 'testAddress1',
        ipAddress: 'testIP',
        url: 'testUrl'
      };

      const testSecondNodeDetails = {
        name: 'testName2',
        logo: 'testLogo',
        description: 'testDescription',
        dataFeedId: 'testId',
        evmAddress: 'testAddress2',
        ipAddress: 'testIP',
        url: 'testUrl'
      };
      await testEnv.interact<NodesInput>(caller, contractId, {
        function: 'registerNode',
        data: testFirstNodeDetails
      });
      const interaction = await testEnv.interact<NodesInput>('0x00', contractId, {
        function: 'registerNode',
        data: testSecondNodeDetails
      });
      const firstNode = interaction.state.nodes[caller];
      const secondNode = interaction.state.nodes['0x00'];
      expect(firstNode).toEqual(testFirstNodeDetails);
      expect(secondNode).toEqual(testSecondNodeDetails);
    });

    test('throw error if missing node name in input', async () => {
      const invalidNodeDetails = {
        logo: 'testLogo',
        description: 'testDescription',
        dataFeedId: 'testId',
        ipAddress: 'testIP',
        evmAddress: 'testAddress',
        url: 'testUrl'
      }
      await expect(
        testEnv.interact<NodesInput>(caller, contractId, {
          function: 'registerNode',
          data: invalidNodeDetails as RegisterNodeInputData
        })
      )
      .rejects
      .toThrowError('Invalid node data');
    });
  });

  describe('updateNodeDetails', () => {
    beforeEach(async () => {
      const testNodeDetails = {
        name: 'testName1',
        logo: 'testLogo',
        description: 'testDescription',
        dataFeedId: 'testId',
        evmAddress: 'testAddress',
        ipAddress: 'testIP',
        url: 'testUrl'
      };
      await testEnv.interact<NodesInput>(caller, contractId, {
        function: 'registerNode',
        data: testNodeDetails
      });
    });

    test('should update node details', async () => {
      const newNodeDetails = {
        name: 'newTestName',
        logo: 'newTestLogo',
        description: 'newTestDescription',
        dataFeedId: 'newTestId',
        evmAddress: 'testAddress',
        ipAddress: 'newTestIP',
        url: 'newTestUrl'
      };
      const interaction = await testEnv.interact<NodesInput>(caller, contractId, {
        function: 'updateNodeDetails',
        data: newNodeDetails
      });
      const node = interaction.state.nodes[caller];
      expect(node).toEqual(newNodeDetails);
    });
  
    test('throw error if invalid owner address', async () => {
      const newNodeDetails = {
        name: 'newTestName',
        logo: 'newTestLogo',
        description: 'newTestDescription',
        dataFeedId: 'newTestId',
        evmAddress: 'testAddress',
        ipAddress: 'newTestIP',
        url: 'newTestUrl'
      };
      await expect(
        testEnv.interact<NodesInput>('notOwner', contractId, {
          function: 'updateNodeDetails',
          data: newNodeDetails
        })
      )
      .rejects
      .toThrowError('Node with owner notOwner not found');
    });
  });

  describe('removeNode', () => {
    beforeEach(async () => {
      const testNodeDetails = {
        name: 'testName1',
        logo: 'testLogo',
        description: 'testDescription',
        dataFeedId: 'testId',
        evmAddress: 'testAddress',
        ipAddress: 'testIP',
        url: 'testUrl'
      };
      await testEnv.interact<NodesInput>(caller, contractId, {
        function: 'registerNode',
        data: testNodeDetails
      });
    });

    test('should remove node', async () => {
      const interaction = await testEnv.interact<NodesInput>(caller, contractId, {
        function: 'removeNode',
        data: {}
      });
      const node = interaction.state.nodes[caller];
      expect(node).toBeUndefined();
    });

    test('throw error if invalid owner address', async () => {
      await expect(
        testEnv.interact<NodesInput>('notOwner', contractId, {
          function: 'removeNode',
          data: {}
        })
      )
      .rejects
      .toThrowError('Node with owner notOwner not found');
    });
  });
});