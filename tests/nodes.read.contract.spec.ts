import { NodesInput } from '../src/nodes/types';
import ContractsTestingEnv from '../src/tools/ContractsTestingEnv';
import { mockNodes } from './helpers/nodes.mock';

const contractSourcePath = './src/nodes/nodes.contract.ts';
const caller = 'bYz5YKzHH97983nS8UWtqjrlhBHekyy-kvHt_eBxBBY'

describe('Nodes contract - read', () => {
  const testEnv = new ContractsTestingEnv();
  let contractId: string

  const initialState = {
    canEvolve: true,
    contractAdmins: ['bYz5YKzHH97983nS8UWtqjrlhBHekyy-kvHt_eBxBBY'],
    nodes: mockNodes
  };

  beforeAll(() => {
    contractId = testEnv.deployContract(contractSourcePath, initialState);
  });

  afterAll(() => {
    testEnv.clearContracts();
  });

  describe('listNodes', () => {
    test('list all nodes', async () => {
      const interaction = await testEnv.interact<NodesInput>(caller, contractId, {
        function: 'listNodes',
        data: {}
      });
      const expectedNodes = [
        'testNodeAddress1',
        'testNodeAddress2',
        'testNodeAddress3',
        'testNodeAddress4',
        'testNodeAddress5',
        'testNodeAddress6'
      ];
      expect(interaction.result).toEqual(expectedNodes);
    });

    test('list nodes limited to 2', async () => {
      const interaction = await testEnv.interact<NodesInput>(caller, contractId, {
        function: 'listNodes',
        data: {
          limit: 2
        }
      });
      const expectedNodes = [
        'testNodeAddress1',
        'testNodeAddress2'
      ];
      expect(interaction.result).toEqual(expectedNodes);
    });
  
    test('list nodes after third', async () => {
      const interaction = await testEnv.interact<NodesInput>(caller, contractId, {
        function: 'listNodes',
        data: {
          startAfter: 3
        }
      });
      const expectedNodes = [
        'testNodeAddress4',
        'testNodeAddress5',
        'testNodeAddress6'
      ];
      expect(interaction.result).toEqual(expectedNodes);
    });

    test('list nodes limited to 3 after second', async () => {
      const interaction = await testEnv.interact<NodesInput>(caller, contractId, {
        function: 'listNodes',
        data: {
          limit: 3,
          startAfter: 2
        }
      });
      const expectedNodes = [
        'testNodeAddress3',
        'testNodeAddress4',
        'testNodeAddress5',
      ];
      expect(interaction.result).toEqual(expectedNodes);
    });
  });

  describe('getNodeDetails', () => {  
    test('get details of first node', async () => {
      const interaction = await testEnv.interact<NodesInput>(caller, contractId, {
        function: 'getNodeDetails',
        data: {
          address: 'testNodeAddress1'
        }
      });
      const expectedNodeDetails = {
        address: 'testNodeAddress1',
        name: 'testName1',
        logo: 'logo',
        description: 'testDescription',
        dataFeedId: 'testId',
        evmAddress: 'testAddress',
        ipAddress: 'testIpAddress',
        url: 'testUrl',
        owner: 'bYz5YKzHH97983nS8UWtqjrlhBHekyy-kvHt_eBxBBY'
      };
      expect(interaction.result).toEqual(expectedNodeDetails);
    });

    test('get details of middle node', async () => {
      const interaction = await testEnv.interact<NodesInput>(caller, contractId, {
        function: 'getNodeDetails',
        data: {
          address: 'testNodeAddress4'
        }
      });
      const expectedNodeDetails = {
        address: 'testNodeAddress4',
        name: 'testName4',
        logo: 'logo',
        description: 'testDescription',
        dataFeedId: 'testId',
        evmAddress: 'testAddress',
        ipAddress: 'testIpAddress',
        url: 'testUrl',
        owner: 'bYz5YKzHH97983nS8UWtqjrlhBHekyy-kvHt_eBxBBY'
      };
      expect(interaction.result).toEqual(expectedNodeDetails);
    });
  
    test('throw error if no address in input', async () => {
      await expect(
        testEnv.interact<NodesInput>(caller, contractId, {
          function: 'getNodeDetails',
          data: {}
        })
      )
      .rejects
      .toThrowError('Missing node address');
    });
  
    test('throw error if invalid address in input', async () => {
      await expect(
        testEnv.interact<NodesInput>(caller, contractId, {
          function: 'getNodeDetails',
          data: {
            address: 'invalidNodeAddress'
          }
        })
      )
      .rejects
      .toThrowError('Node with address invalidNodeAddress do not exist');
    });
  });
});
