import * as utils from '../utils/utils';
import * as backendApi from '../api/backend-api';

export class InterfaceHolon {
  // Creation time
  creationTime = new Date();
  // This ID is reserved for interface holon, do not change it!
  id = -123131;
  // Name
  name = 'InterfaceHolon';
  // Perception is an object with following properties: type, content
  perceptions = [];
  handledPerceptions = [];
  // Unread messages
  // Message is an object with following properties: sender, type, content, ontology, receiver and conversation ID
  messages = [];
  // Messages that have been read
  readMessages = [];
  // Data - has two fields: allocations (array) and completedAllocations (array)
  // completedAllocations elements are objects that following fields: allocationId (number), result (json), completeTime (date), isUpdatedToServer (boolean)
  data = {
    allocations: [],
    completedAllocations: [],
  };

  // Holon is active
  isActive = true;

  // Progress properties
  allocationIsRunning = false;
  allocationId = null;
  allocationStartTime = null;

  // Update to database properties
  updatingToDatabase = false;

  latest_state = {
    representativeHolon: null,
    status: holonStatus.na,
    type: holonTypes.na,
    position: holonPositions.na,
    parentHolon: null,
    childHolons: [],
    layerHolons: [],
  };

  // Intervals
  cacheCleanerInterval = setInterval(() => {
    this.cacheCleaner();
  }, 30000);
  databaseUpdaterInterval = setInterval(() => {
    this.updateToDatabase();
  }, 1000);

  constructor() {
    setTimeout(() => {
      this.run();
      utils.log('Status', 'Interface holon - holon has been started');
    }, 5000);
  }

  run = async () => {
    while (true) {
      if (!this.isActive) break;
      await utils.wait(0.3);
      if (!Array.isArray(this.data.allocations) && !Array.isArray(this.data.completedAllocations)) continue;

      try {
        // Time constraint - if allocation last more than 180 seconds return result with error
        if (this.allocationIsRunning && (new Date() - this.allocationStartTime) / 1000 > 180) {
          this.data.completedAllocations.push({
            allocationId: this.allocationId,
            result: JSON.stringify({ error: 'HMAS Container interrupted allocation due to time out constraint' }),
          });
          this.allocationIsRunning = false;
          this.allocationId = null;
          this.allocationStartTime = null;
        }

        // Check if allocation has completed
        if (this.allocationIsRunning && (new Date() - this.allocationStartTime) / 1000 < 180) {
          const isRunning = this.data.completedAllocations.every((allocation) => {
            if (allocation.allocationId === this.allocationId) {
              this.allocationIsRunning = false;
              this.allocationId = null;
              this.allocationStartTime = null;
              return false;
            }
            return true;
          });
          if (isRunning) continue;
        }

        // Pick a new allocation from this.data.allocations
        // Formatting allocation happens here
        for (let i = 0; i < this.data.allocations.length; i++) {
          const candidateAllocation = utils.formatAllocation(this.data.allocations[i]);
          if (candidateAllocation.created_on > this.creationTime && candidateAllocation.reallocate && !this.data.completedAllocations.map((i) => i.allocationId).includes(candidateAllocation.id)) {
            this.startAllocation(candidateAllocation);
            break;
          }
        }
      } catch (err) {
        this.allocationIsRunning = false;
        this.allocationId = null;
        this.allocationStartTime = null;
      }
    }
  };

  /**
   * Send allocation request to core holon
   * @param {object} allocation formatted and correct allocation
   */
  startAllocation = async (allocation) => {
    try {
      this.allocationIsRunning = true;
      this.allocationId = allocation.id;
      this.allocationStartTime = new Date();

      let startResponse = await backendApi.markAllocationStarted(allocation.id);
      if (startResponse && startResponse.errors.length === 0 && Number(startResponse.data[0].attributes.id) === allocation.id) {
        utils.log('Status', 'Interface holon - allocation of the allocation request ' + allocation.id + ' has started');
        this.sendMessage({ sender: -33333, conversationId: utils.generateRandomNumber() }, 'allocationRequest', { allocationRequest: { allocation } }, 'allocations');
      } else {
        throw new Error();
      }
    } catch (err) {
      this.allocationIsRunning = null;
      this.allocationId = null;
      this.allocationStartTime = null;
      utils.log('Status', ' Interace holon - allocation of the allocation request ' + allocation.id + ' failed');
    }
  };

  updateToDatabase = async () => {
    try {
      if (this.updatingToDatabase) return;
      else this.updatingToDatabase = true;
      for (let i = 0; i < this.data.completedAllocations.length; i++) {
        const allocation = this.data.completedAllocations[i];
        if (!allocation.isUpdatedToServer) {
          const serverResponse = await backendApi.updateAllocationResult(allocation.allocationId, allocation.result);
          if (serverResponse && serverResponse.errors.length === 0 && serverResponse.data[0].attributes.id === allocation.allocationId) {
            allocation.isUpdatedToServer = true;
            utils.log('Status', 'Interface holon - allocation request with ID ' + allocation.allocationId + ' has been updated to server');
          } else if (serverResponse && serverResponse.errors.length > 0) {
            switch (serverResponse.errors[0].status) {
              // Allocation has been deleted
              case 404:
                test.data.completedAllocations.splice(i, 1);
                i = 0;
                break;
            }
          } else {
            utils.log('Status', 'Interface holon - allocation request with ID ' + allocation.allocationId + ' is completed but could not be updated to server');
          }
        }
      }
    } catch (err) {
      utils.log('Error', 'Interface holon - Error occured while updating completed allocations to server');
    }
    this.updatingToDatabase = false;
  };

  receiveMessage(message) {
    this.messages.push(message);
    this.readMessage();
  }

  receivePerception(perception) {
    this.perceptions.push(perception);
    this.handlePerceptions();
  }

  handlePerceptions() {
    const perceptions = this.perceptions;
    this.perceptions = [];
    perceptions.forEach((perception) => {
      if (perception.type === 'allocationsUpdate' && Array.isArray(perception.content.allocations)) {
        utils.log('Status', 'Interface holon - allocations have been updated');
        let allocations = [];
        perception.content.allocations.forEach((all) => {
          if (utils.isAllocationFormatValid(all)) {
            allocations.push(JSON.parse(JSON.stringify(all)));
          }
        });
        this.data.allocations = allocations;
      }
    });
    this.handledPerceptions = this.handledPerceptions.concat(perceptions);
  }

  readMessage() {
    const messages = this.messages;
    this.messages = [];
    messages.forEach((message) => {
      switch (message.type) {
        case 'allocationCompleted':
          // message.content has following properties: result (JSON) and allocationId (number)
          if (message.ontology === 'allocations' && message.content.result && utils.isNumber(message.content.allocationId)) {
            utils.log('Status', 'Interface holon - received completed allocation');
            this.allocationCompleted(message.content.allocationId, message.content.result);
          }
          break;
      }
    });
    this.readMessages = this.readMessages.concat(messages);
  }

  allocationCompleted = (allocationId, result) => {
    if (!Array.isArray(this.data.completedAllocations)) this.data.completedAllocations = [];
    this.data.completedAllocations.push({ allocationId, result, completeTime: new Date(), isUpdatedToServer: false });
  };

  sendMessage(receivedMessage, type, content, ontology) {
    const message = {};
    message.sender = this.id;
    message.type = type;
    message.content = content;
    message.ontology = ontology;
    message.receiver = receivedMessage.sender;
    message.conversationId = receivedMessage.conversationId;

    this.latest_state.layerHolons.forEach((holon) => {
      if (holon.id === message.receiver) holon.receiveMessage(message);
    });
  }

  cacheCleaner = () => {
    let deletedAllocations = [];
    this.data.completedAllocations.forEach((allocation) => {
      if (allocation.isUpdatedToServer)
        this.data.allocations.forEach((rawAllocation) => {
          const formattedAllocation = utils.formatAllocation(rawAllocation);
          if (formattedAllocation.id === allocation.allocationId && !formattedAllocation.reallocate) {
            deletedAllocations.push(allocation);
          }
        });
    });

    if (deletedAllocations.length > 0)
      this.data.completedAllocations = this.data.completedAllocations.filter((allocation) => {
        if (!deletedAllocations.map((i) => i.allocationId).includes(allocation.allocationId)) return true;
        else return false;
      });

    if (this.data.completedAllocations.length === 0) {
      utils.log('Status', 'Interface holon - all completed allocations have been updated to server');
    }
  };

  stop() {
    this.isActive = false;
    clearInterval(this.cacheCleanerInterval);
    clearInterval(this.databaseUpdaterInterval);
    this.data = {};
    utils.log('Status', 'Interface holon - stopped');
  }
}

// CONSTANTS
const holonStatus = {
  na: 'N/A',
  idle: 'IDLE',
  running: 'RUNNING',
  stopped: 'STOPPED',
  finished: 'FINISHED',
};

const holonTypes = {
  na: 'N/A',
  reflex: 'REFLEX',
  model: 'MODEL',
  goal: 'GOAL',
  utility: 'UTILITY',
};

const holonPositions = {
  na: 'N/A',
  super: 'SUPER',
  representative: 'REPRESENTATIVE',
  multipart: 'MULTIPART',
  singlepart: 'SINGLEPART',
  atomic: 'ATOMIC',
};
